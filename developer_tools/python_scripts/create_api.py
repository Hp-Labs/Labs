import os

os.makedirs('src/app/api/users/daily-bonus', exist_ok=True)
route_content = '''import { NextResponse } from "next/server";
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
}
'''
with open('src/app/api/users/daily-bonus/route.ts', 'w', encoding='utf-8') as f:
    f.write(route_content)
print("Created daily-bonus API route")
