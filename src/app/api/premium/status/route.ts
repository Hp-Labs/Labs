import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/services/sessionStore";
import { getUserById } from "@/lib/services/userStore";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("hplabs_session_id")?.value;
  if (!sessionId) {
    return NextResponse.json({ isPremium: false, premiumUntil: null });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ isPremium: false, premiumUntil: null });
  }

  const user = getUserById(session.id);
  if (!user) {
    return NextResponse.json({ isPremium: false, premiumUntil: null });
  }

  const { effectivePlan, expiry } = require('@/lib/services/entitlements').recalculateUserAccess(user.id);
  const isPremium = effectivePlan !== 'FREE';

  return NextResponse.json({ 
    isPremium, 
    premiumUntil: expiry 
  });
}
