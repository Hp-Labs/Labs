import { NextRequest, NextResponse } from "next/server";
import { getSession, destroySession, refreshSession } from "@/lib/services/sessionStore";
import { getUserById } from "@/lib/services/userStore";
import { recalculateUserAccess } from "@/lib/services/entitlements";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("hplabs_session_id")?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const sessionUser = getSession(sessionId);
  if (!sessionUser) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Recalculate entitlements from DB (server-authoritative)
  recalculateUserAccess(sessionUser.id);

  // Get fresh user from DB
  const freshUser = getUserById(sessionUser.id);
  if (!freshUser) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // MFA check
  const isSuperAdmin = freshUser.email === 'info@hackerplus.in';
  const mfaEnabled = isSuperAdmin || freshUser.mfaEnabled;
  if (mfaEnabled && !sessionUser.mfaVerified) {
    return NextResponse.json({ authenticated: false, mfaRequired: true }, { status: 403 });
  }

  // Reject suspended accounts immediately
  if (freshUser.suspended) {
    destroySession(sessionId);
    const res = NextResponse.json({ authenticated: false, suspended: true }, { status: 403 });
    res.cookies.delete("hplabs_session_id");
    return res;
  }

  const db = getDb();

  // Check if they have an EXPIRED collab entitlement
  const expiredCollab = db.prepare(
    "SELECT 1 FROM entitlements WHERE user_id = ? AND source = 'COLLABORATION' AND status = 'EXPIRED' LIMIT 1"
  ).get(sessionUser.id);

  // Strip sensitive fields from response
  const { passwordHash, passwordSalt, ...safeUser } = freshUser; 
  const isGodMode = isSuperAdmin && sessionUser.loggedInViaAdminPortal === true;
  
  (safeUser as any).isAdmin = isGodMode;
  (safeUser as any).loggedInViaAdminPortal = sessionUser.loggedInViaAdminPortal;
  
  if (isGodMode) {
    safeUser.plan = 'ADVANCED';
    safeUser.premiumUntil = null;
  }

  return NextResponse.json({ 
    authenticated: true, 
    user: safeUser,
    hasExpiredCollab: !!expiredCollab
  });
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.cookies.get("hplabs_session_id")?.value;
  if (sessionId) {
    destroySession(sessionId);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("hplabs_session_id");
  return response;
}

export async function PATCH(req: NextRequest) {
  const sessionId = req.cookies.get("hplabs_session_id")?.value;
  if (!sessionId) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const refreshed = refreshSession(sessionId);
  if (!refreshed) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("hplabs_session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60 // 24 hours
  });

  return response;
}
