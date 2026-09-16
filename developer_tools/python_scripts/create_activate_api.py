import os
os.makedirs("src/app/api/labs/[id]/activate", exist_ok=True)
path = "src/app/api/labs/[id]/activate/route.ts"
content = """import { NextResponse } from "next/server";
import { getSession } from "@/lib/services/sessionStore";
import { createLabSession, getLabSession, getUserLabSessions } from "@/lib/services/labSessionStore";
import { getLabById } from "@/lib/data/redteam";
import { getUserById } from "@/lib/services/userStore";

// Fake HPVuln generator for now, based on the original frontend logic
function randomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomDomain(labId: string) {
  return `${labId.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).substring(2,8)}.hpvuln.in`;
}

function getAuthFromRequest(req: Request): { userId: string; authSessionId: string } | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  const authSessionId = match ? match[1].trim() : null;
  if (!authSessionId) return null;
  const sessionUser = getSession(authSessionId);
  if (!sessionUser || !sessionUser.id) return null;
  return { userId: sessionUser.id, authSessionId };
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const labId = params.id;
  const lab = getLabById(labId);
  if (!lab) return NextResponse.json({ error: "Lab not found" }, { status: 404 });

  // Get user to check plan logic if needed
  const user = getUserById(auth.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let ttlMinutes = 45; // FREE
  if (user.plan === 'BASIC') ttlMinutes = 60;
  if (user.plan === 'INTERMEDIATE') ttlMinutes = 90;
  if (user.plan === 'ADVANCED') ttlMinutes = 120;

  // Check if session already exists
  const activeSessions = getUserLabSessions(auth.userId);
  const existing = activeSessions.find(s => s.labId === labId && !s.completed);
  
  if (existing) {
    return NextResponse.json({
      success: true,
      labSessionId: existing.labSessionId,
      expiresAt: existing.expiresAt,
      targetIp: existing.targetIp,
      targetDomain: existing.targetDomain,
    });
  }

  const targetIp = randomIP();
  const targetDomain = randomDomain(labId);

  const sessionId = createLabSession(
    auth.userId,
    labId,
    auth.authSessionId,
    ttlMinutes * 60 * 1000,
    targetIp,
    targetDomain
  );

  const newSession = getLabSession(sessionId);

  return NextResponse.json({
    success: true,
    labSessionId: sessionId,
    expiresAt: newSession?.expiresAt,
    targetIp,
    targetDomain
  });
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Created activate API")
