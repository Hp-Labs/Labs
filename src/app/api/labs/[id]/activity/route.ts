import { NextResponse } from "next/server";
import { getUserById, deductUserXP } from "@/lib/services/userStore";
import { getSession } from "@/lib/services/sessionStore";
import {
  createLabSession,
  recordActivity,
  resetLabSession,
  getLabSession,
  getUserLabSessions,
  destroyLabSession
} from "@/lib/services/labSessionStore";

function getAuthFromRequest(req: Request): { userId: string; authSessionId: string } | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  const authSessionId = match ? match[1].trim() : null;
  if (!authSessionId) return null;
  const sessionUser = getSession(authSessionId);
  if (!sessionUser || !sessionUser.id) return null;
  return { userId: sessionUser.id, authSessionId };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: labId } = await params;

  const auth = getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId, authSessionId } = auth;
  
  const body = await request.json();
  const { action, sessionId: labSessionId } = body;

  try {
    if (action === "start") {
      const { getLabById } = await import("@/lib/data/redteam"); 
      const { VULNERABILITIES } = await import("@/lib/data/vulnerabilities"); 
      const exists = getLabById(labId) || VULNERABILITIES.find(v => v.id === labId); 
      if (!exists) return NextResponse.json({ error: "Lab not found" }, { status: 404 }); 
      
      // Destroy any existing session for this lab to avoid duplicates
      const existing = getUserLabSessions(userId).find(s => s.labId === labId);
      if (existing) {
        destroyLabSession(existing.labSessionId);
      }

      const user = getUserById(userId);
      const isPremiumValid = user?.premiumUntil ? user.premiumUntil > Date.now() : false;
      const plan = (isPremiumValid && user?.plan) ? user.plan : 'FREE';
      
      let ttlMs = 45 * 60 * 1000; // Free: 45 min
      if (plan === 'BASIC') ttlMs = 60 * 60 * 1000; // 1 hour
      else if (plan === 'INTERMEDIATE') ttlMs = 90 * 60 * 1000; // 1.5 hours
      else if (plan === 'ADVANCED') ttlMs = 120 * 60 * 1000; // 2 hours

      const newLabSessionId = createLabSession(userId, labId, authSessionId, ttlMs);
      const session = getLabSession(newLabSessionId);
      return NextResponse.json({ sessionId: newLabSessionId, session });
    }
    
    if (action === "current") {
      // Find active session for this user and lab
      const sessions = getUserLabSessions(userId);
      const activeSession = sessions.find(s => s.labId === labId && s.expiresAt > Date.now());
      if (activeSession) {
        return NextResponse.json({ session: activeSession });
      }
      return NextResponse.json({ session: null });
    }

    if (action === "activity") {
      if (!labSessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
      try {
        const session = recordActivity(labSessionId, userId);
        return NextResponse.json({ success: true, activityScore: session.activityScore });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: err.status || 403 });
      }
    }

    
    if (action === "timeout") {
      if (!labSessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
      try {
        const session = getLabSession(labSessionId);
        if (session && session.userId === userId && !session.completed) {
            // Dynamically calculate 50% penalty based on lab reward
            const { getLabById } = await import("@/lib/data/redteam");
            const { VULNERABILITIES } = await import("@/lib/data/vulnerabilities");
            const lab = getLabById(labId) || VULNERABILITIES.find(v => v.id === labId);
            const reward = lab?.xpReward || 50;
            const penalty = Math.max(1, Math.floor(reward / 2)); // 50% of the reward
            
            deductUserXP(userId, penalty);
            destroyLabSession(labSessionId);
            return NextResponse.json({ success: true, penalty });
        }
        return NextResponse.json({ error: "Session invalid or already completed" }, { status: 400 });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: err.status || 403 });
      }
    }

    if (action === "reset") {
      if (!labSessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
      try {
        destroyLabSession(labSessionId);
        return NextResponse.json({ success: true });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: err.status || 403 });
      }
    }

    if (action === "status") {
      if (!labSessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
      const session = getLabSession(labSessionId);
      if (!session) return NextResponse.json({ error: "Lab session not found or expired." }, { status: 401 });
      if (session.userId !== userId) return NextResponse.json({ error: "Lab session does not belong to this user." }, { status: 403 });
      if (session.labId !== labId) return NextResponse.json({ error: "Lab session is for a different lab." }, { status: 403 });
      return NextResponse.json({ session });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { id: labId } = await params;
  
  // Find an active session for this user and lab
  const activeSessions = getUserLabSessions(auth.userId).filter(s => s.labId === labId && !s.completed);
  
  if (activeSessions.length > 0) {
     const session = activeSessions[0];
     // Check if it's expired
     if (session.expiresAt && Date.now() > session.expiresAt) {
         destroyLabSession(session.labSessionId);
         return NextResponse.json({ active: false });
     }
     return NextResponse.json({ active: true, session });
  }
  return NextResponse.json({ active: false });
}
