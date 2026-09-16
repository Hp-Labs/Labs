import { NextResponse } from "next/server";
import { getSession, refreshSession } from "@/lib/services/sessionStore";
import { getUserLabSessions } from "@/lib/services/labSessionStore";

import { cookies } from "next/headers";

async function asyncGetAuthSessionId(): Promise<string | null> {
  try {
    const c = cookies();
    const val = (await c).get("hplabs_session_id")?.value;
    return val || null;
  } catch (e) {
    return null;
  }
}

async function getAuthFromRequest(req: Request): Promise<{ userId: string; authSessionId: string } | null> {
  try {
    let authSessionId = await asyncGetAuthSessionId();
    if (!authSessionId) {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
      authSessionId = match ? decodeURIComponent(match[1].trim()) : null;
    }

    if (!authSessionId) return null;
    const sessionUser = getSession(authSessionId);
    if (!sessionUser || !sessionUser.id) return null;
    refreshSession(authSessionId);
    return { userId: sessionUser.id, authSessionId };
  } catch (e) {
    console.error("[session] Error parsing auth:", e);
    return null;
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ active: false });

    const resolvedParams = await params;
    const labId = resolvedParams.id;
    
    const { getLabById } = require('@/lib/data/redteam');
    const lab = getLabById(labId);
    if (lab) {
      const { effectivePlan } = require('@/lib/services/entitlements').recalculateUserAccess(auth.userId);
      const isPremiumLab = lab.severity === 'medium' || lab.severity === 'high' || lab.severity === 'critical';
      if (isPremiumLab && effectivePlan === 'FREE') {
         return NextResponse.json({ active: false });
      }
    }

    const allSessions = getUserLabSessions(auth.userId);
    const existing = allSessions.find(
      (s) => s.labId === labId && !s.completed && s.expiresAt > Date.now()
    );

    if (existing) {
      return NextResponse.json({
        active: true,
        labSessionId: existing.labSessionId,
        expiresAt: existing.expiresAt,
        targetIp: existing.targetIp,
        targetDomain: existing.targetDomain,
      });
    }

    return NextResponse.json({ active: false });
  } catch (e) {
    console.error("[session] Unexpected error:", e);
    return NextResponse.json({ active: false });
  }
}
