import { NextResponse, NextRequest } from "next/server";
import { getSession, updateSession } from "@/lib/services/sessionStore";
import { consumeRateLimit } from "@/lib/services/rateLimiter";
import { logSecurityEvent, getDb } from "@/lib/db";
import { verify } from "otplib";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("hplabs_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sessionData = getSession(sessionId);
    if (!sessionData) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    const { otp } = await req.json();
    if (!otp || typeof otp !== "string") {
      return NextResponse.json({ success: false, message: "OTP is required" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!consumeRateLimit(`mfa_ip_${ip}`, 10, 15 * 60 * 1000) || 
        !consumeRateLimit(`mfa_acc_${sessionData.id}`, 5, 15 * 60 * 1000)) {
      logSecurityEvent({ eventType: "mfa_bruteforce", userId: sessionData.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: "Too many attempts" }, { status: 429 });
    }

    const db = getDb();
    const userRow = db.prepare("SELECT mfa_secret FROM users WHERE id = ?").get(sessionData.id) as any;
    if (!userRow || !userRow.mfa_secret) {
      return NextResponse.json({ success: false, message: "MFA not configured for this user" }, { status: 400 });
    }

    const isValid = await verify({ token: otp, secret: userRow.mfa_secret });
    
    if (!isValid) {
      logSecurityEvent({ eventType: "mfa_failed", userId: sessionData.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: "Invalid verification code" }, { status: 401 });
    }

    // Update session
    sessionData.mfaVerified = true;
    updateSession(sessionId, sessionData);

    logSecurityEvent({ eventType: "mfa_success", userId: sessionData.id, ip });

    return NextResponse.json({ success: true, user: sessionData });
  } catch (e) {
    console.error("MFA Verify Error:", e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
