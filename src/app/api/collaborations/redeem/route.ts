import { NextResponse } from "next/server";
import { getSession } from "@/lib/services/sessionStore";
import { redeemCollabCoupon } from "@/lib/services/collaborationStore";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const authSessionId = match ? match[1].trim() : null;
    
    if (!authSessionId) {
      return NextResponse.json({ success: false, error: "You must be logged in to redeem a coupon." }, { status: 401 });
    }
    
    const sessionUser = getSession(authSessionId);
    if (!sessionUser || !sessionUser.id) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required." }, { status: 400 });
    }

    const result = redeemCollabCoupon(sessionUser.id, code);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (err) {
    console.error("Collab redeem error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
