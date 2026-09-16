import { NextRequest, NextResponse } from "next/server";
import { checkDailyBonusAvailable, awardDailyBonus } from "@/lib/services/userStore";
import { getSession } from "@/lib/services/sessionStore";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("hplabs_session_id")?.value;
  if (!sessionId) return NextResponse.json({ available: false }, { status: 401 });
  const user = getSession(sessionId);
  if (!user) return NextResponse.json({ available: false }, { status: 401 });

  const available = checkDailyBonusAvailable(user.id);
  return NextResponse.json({ available });
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("hplabs_session_id")?.value;
    if (!sessionId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const user = getSession(sessionId);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const result = awardDailyBonus(user.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }
}
