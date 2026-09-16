import os

path = r"src/app/api/users/daily-bonus/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace the GET and POST logic to use getSession
old_code = """import { NextResponse } from "next/server";
import { checkDailyBonusAvailable, awardDailyBonus } from "@/lib/services/userStore";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const available = checkDailyBonusAvailable(userId);
  return NextResponse.json({ available });
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: false, message: "No user ID" }, { status: 400 });
    }

    const result = awardDailyBonus(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }
}"""

new_code = """import { NextRequest, NextResponse } from "next/server";
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
}"""

c = c.replace(old_code, new_code)
with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed daily-bonus authentication")
