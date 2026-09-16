import os

path = "src/app/api/premium/status/route.ts"
os.makedirs(os.path.dirname(path), exist_ok=True)

with open(path, "w", encoding="utf-8") as f:
    f.write("""import { NextRequest, NextResponse } from "next/server";
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

  const now = Date.now();
  const isPremium = user.premiumUntil ? user.premiumUntil > now : false;

  return NextResponse.json({ 
    isPremium, 
    premiumUntil: user.premiumUntil || null 
  });
}
""")

print("Created premium status API")
