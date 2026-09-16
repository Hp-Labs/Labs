import os
os.makedirs("src/app/api/labs/[id]/session", exist_ok=True)
path = "src/app/api/labs/[id]/session/route.ts"
content = """import { NextResponse } from "next/server";
import { getSession } from "@/lib/services/sessionStore";
import { getUserLabSessions } from "@/lib/services/labSessionStore";

function getAuthFromRequest(req: Request): { userId: string; authSessionId: string } | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  const authSessionId = match ? match[1].trim() : null;
  if (!authSessionId) return null;
  const sessionUser = getSession(authSessionId);
  if (!sessionUser || !sessionUser.id) return null;
  return { userId: sessionUser.id, authSessionId };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ active: false }, { status: 401 });

  const resolvedParams = await params;
  const labId = resolvedParams.id;

  const activeSessions = getUserLabSessions(auth.userId);
  const existing = activeSessions.find(s => s.labId === labId && !s.completed);
  
  if (existing && existing.expiresAt > Date.now()) {
    return NextResponse.json({
      active: true,
      labSessionId: existing.labSessionId,
      expiresAt: existing.expiresAt,
      targetIp: existing.targetIp,
      targetDomain: existing.targetDomain,
    });
  }

  return NextResponse.json({ active: false });
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Created session API")
