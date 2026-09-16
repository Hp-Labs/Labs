import { NextResponse } from "next/server";
import { getLabById } from "@/lib/data/redteam";
import { VULNERABILITIES } from "@/lib/data/vulnerabilities";
import { getSession } from "@/lib/services/sessionStore";
import {
  verifyLabSessionOwnership,
  recordHintUsed,
} from "@/lib/services/labSessionStore";

function getAuthFromRequest(req: Request): { userId: string } | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  const authSessionId = match ? match[1].trim() : null;
  if (!authSessionId) return null;
  const user = getSession(authSessionId);
  if (!user?.id) return null;
  return { userId: user.id };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const level = parseInt(searchParams.get("level") || "1", 10);
  const labSessionId = searchParams.get("sessionId");

  // 1. Require authentication
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized: authentication required" }, { status: 401 });
  }
  const { userId } = auth;

  // 2. Require lab session
  if (!labSessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  // 3. Verify session ownership (user + lab binding)
  let session;
  try {
    session = verifyLabSessionOwnership(labSessionId, userId, id);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status || 403 });
  }

  const elapsedMs = Date.now() - session.startTime;
  const elapsedMinutes = elapsedMs / 60000;

  // 4. Enforce progressive timing gates
  if (level === 1) {
    if (elapsedMinutes < 9.5) {
      return NextResponse.json(
        { error: `Hint 1 becomes available at approximately 10 minutes. Please keep testing. (${Math.ceil(10 - elapsedMinutes)} min left)` },
        { status: 403 }
      );
    }
    if (session.activityScore < 5) {
      return NextResponse.json(
        { error: "Hint 1 requires more meaningful lab activity. Keep exploring the target." },
        { status: 403 }
      );
    }
  }

  if (level === 2) {
    if (elapsedMinutes < 14.5) {
      return NextResponse.json(
        { error: `Hint 2 becomes available at approximately 15 minutes. (${Math.ceil(15 - elapsedMinutes)} min left)` },
        { status: 403 }
      );
    }
  }

  if (level === 3) {
    if (elapsedMinutes < 19.5) {
      return NextResponse.json(
        { error: `Hint 3 becomes available at approximately 20 minutes. (${Math.ceil(20 - elapsedMinutes)} min left)` },
        { status: 403 }
      );
    }
  }

  // 5. Resolve lab metadata
  let labName = "";
  let cwe = "";
  let domain = "";

  const redTeamLab = getLabById(id);
  if (redTeamLab) {
    labName = redTeamLab.name;
    cwe = Array.isArray(redTeamLab.cwe) ? redTeamLab.cwe.join(", ") : (redTeamLab.cwe || "misconfiguration");
    domain = redTeamLab.domain;
  } else {
    const legacyLab = VULNERABILITIES.find(v => v.id === id);
    if (!legacyLab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }
    labName = legacyLab.name;
    cwe = legacyLab.category;
    domain = legacyLab.category;
  }

  // 6. Generate hint
  let hint = "";
  if (level === 1) {
    hint = `High-level direction: Focus your investigation on the ${domain} attack surface. Review the application's functionality for potential ${cwe} vulnerabilities.`;
  } else if (level === 2) {
    hint = `Technical direction: Analyze the application's data flow and input validation mechanisms. Look for points where user-controlled data intersects with backend processing related to ${labName}.`;
  } else if (level === 3) {
    hint = `Vulnerability-specific direction: Craft a targeted test for ${labName} by observing how the system responds to unexpected or malformed inputs. Do not rely heavily on automated exploitation tools; carefully read the responses.`;
  } else {
    return NextResponse.json({ error: "Invalid hint level. Use 1, 2, or 3." }, { status: 400 });
  }

  // 7. Record hint usage in lab session
  recordHintUsed(labSessionId, userId, level);

  await new Promise(resolve => setTimeout(resolve, 600));

  return NextResponse.json({ hint });
}