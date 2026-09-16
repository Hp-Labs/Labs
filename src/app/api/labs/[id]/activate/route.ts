import { NextResponse } from "next/server";
import { getSession, refreshSession } from "@/lib/services/sessionStore";
import { createLabSession, getLabSession, getUserLabSessions } from "@/lib/services/labSessionStore";
import { getLabById } from "@/lib/data/redteam";
import { getUserById } from "@/lib/services/userStore";

// Realistic HPVuln target IP range
function randomIP() {
  const octets = [
    `${Math.floor(Math.random() * 30) + 10}`,
    `${Math.floor(Math.random() * 200) + 10}`,
    `${Math.floor(Math.random() * 200) + 10}`,
    `${Math.floor(Math.random() * 200) + 10}`,
  ];
  return octets.join(".");
}

function randomDomain(labId: string) {
  const slug = labId.toLowerCase().replace(/[^a-z0-9]/g, "-").substring(0, 20);
  const rand = Math.random().toString(36).substring(2, 7);
  return `${slug}-${rand}.hpvuln.in`;
}

import { cookies } from "next/headers";

async function asyncGetAuthSessionId(): Promise<string | null> {
  // Try to use cookies() properly based on Next.js 15 async cookies
  try {
    const c = cookies();
    // In Next 15, cookies() might need await in some contexts, but let's just do standard get
    const val = (await c).get("hplabs_session_id")?.value;
    return val || null;
  } catch (e) {
    console.error("[activate] Error reading cookies with next/headers:", e);
    return null;
  }
}

async function getAuthFromRequest(req: Request): Promise<{ userId: string; authSessionId: string } | null> {
  try {
    let authSessionId = await asyncGetAuthSessionId();
    
    // Fallback to manual parsing just in case
    if (!authSessionId) {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
      authSessionId = match ? decodeURIComponent(match[1].trim()) : null;
    }

    if (!authSessionId) {
      console.error("[activate] No hplabs_session_id cookie found in request");
      return null;
    }
    const sessionUser = getSession(authSessionId);
    if (!sessionUser || !sessionUser.id) {
      console.error("[activate] Auth session not found or expired for sessionId:", authSessionId.substring(0, 8) + "...");
      return null;
    }
    // Auto-refresh the session so it doesn't expire while a lab is active
    refreshSession(authSessionId);
    return { userId: sessionUser.id, authSessionId };
  } catch (e) {
    console.error("[activate] Error parsing auth cookie:", e);
    return null;
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const labId = resolvedParams.id;

    console.log(`[activate] POST /api/labs/${labId}/activate`);

    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const lab = getLabById(labId);
    if (!lab) {
      console.error(`[activate] Lab not found: ${labId}`);
      return NextResponse.json({ success: false, error: "Lab not found." }, { status: 404 });
    }

    const user = getUserById(auth.userId);
    if (!user) {
      console.error(`[activate] User not found: ${auth.userId}`);
      return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
    }

    // Force server-authoritative entitlement recalculation to prevent accidental access
    const { effectivePlan } = require('@/lib/services/entitlements').recalculateUserAccess(auth.userId);
    
    // Evaluate premium lock (Medium, High, Critical labs require paid or collab plan)
    const isPremiumLab = lab.severity === 'medium' || lab.severity === 'high' || lab.severity === 'critical';
    if (isPremiumLab && effectivePlan === 'FREE') {
       return NextResponse.json({ success: false, error: "Premium lab access requires an active subscription or collaboration entitlement." }, { status: 403 });
    }

    // TTL based on subscription plan
    let ttlMinutes = lab.timeLimitMinutes || 45; // use lab's own time limit as base
    if (effectivePlan === "BASIC") ttlMinutes = Math.max(ttlMinutes, 60);
    if (effectivePlan === "INTERMEDIATE") ttlMinutes = Math.max(ttlMinutes, 90);
    if (effectivePlan === "PREMIUM" || effectivePlan === "ADVANCED") ttlMinutes = Math.max(ttlMinutes, 120);

    // Check for existing active (non-completed, non-expired) session
    const allSessions = getUserLabSessions(auth.userId);
    const existing = allSessions.find(
      (s) => s.labId === labId && !s.completed && s.expiresAt > Date.now()
    );

    if (existing) {
      console.log(`[activate] Returning existing session for lab ${labId}, user ${auth.userId}`);
      return NextResponse.json({
        success: true,
        labSessionId: existing.labSessionId,
        expiresAt: existing.expiresAt,
        targetIp: existing.targetIp || randomIP(),
        targetDomain: existing.targetDomain || randomDomain(labId),
      });
    }

    // Create new session
    const targetIp = randomIP();
    const targetDomain = randomDomain(labId);
    const ttlMs = ttlMinutes * 60 * 1000;

    console.log(`[activate] Creating new lab session: lab=${labId}, user=${auth.userId}, ttl=${ttlMinutes}min, ip=${targetIp}`);

    const sessionId = createLabSession(
      auth.userId,
      labId,
      auth.authSessionId,
      ttlMs,
      targetIp,
      targetDomain
    );

    const newSession = getLabSession(sessionId);
    if (!newSession) {
      console.error(`[activate] Failed to retrieve session after creation: ${sessionId}`);
      return NextResponse.json({ success: false, error: "Session creation failed. Please try again." }, { status: 500 });
    }

    console.log(`[activate] Session created successfully: ${sessionId}, expiresAt=${newSession.expiresAt}`);

    return NextResponse.json({
      success: true,
      labSessionId: sessionId,
      expiresAt: newSession.expiresAt,
      targetIp,
      targetDomain,
    });
  } catch (e) {
    console.error("[activate] Unexpected error:", e);
    return NextResponse.json(
      { success: false, error: "Internal server error. Check server logs." },
      { status: 500 }
    );
  }
}
