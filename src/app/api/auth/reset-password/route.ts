import { NextResponse, NextRequest } from "next/server";
import { getUserByEmail, updateUser, hashPassword } from "@/lib/services/userStore";
import { verifyAndDeletePasswordResetToken } from "@/lib/services/otpStore";
import { consumeRateLimit } from "@/lib/services/rateLimiter";
import { logSecurityEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    if (!consumeRateLimit(`pw_reset_submit_ip_${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ success: false, message: 'Too many attempts from this IP. Try again later.' }, { status: 429 });
    }

    const { email, token, newPassword } = await req.json();
    if (!email || !token || !newPassword) {
      return NextResponse.json({ success: false, message: "Missing fields." }, { status: 400 });
    }

    const normEmail = email.trim().toLowerCase();
    
    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json({ success: false, message: "Password must be 8-128 characters." }, { status: 400 });
    }

    const user = getUserByEmail(normEmail);
    if (!user) {
      // Do not reveal if user exists or not on invalid token.
      return NextResponse.json({ success: false, message: "Invalid or expired reset token." }, { status: 400 });
    }

    // Attempt to verify and consume the token
    const isValid = verifyAndDeletePasswordResetToken(normEmail, token);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Invalid or expired reset token." }, { status: 400 });
    }

    // Generate new hash and salt
    const { hash, salt } = hashPassword(newPassword);

    // Update user
    updateUser(user.id, {
      passwordHash: hash,
      passwordSalt: salt
    });

    logSecurityEvent({
      eventType: "password_reset_success",
      userId: user.id
    });

    return NextResponse.json({ success: true, message: "Password has been successfully reset. You can now login." });
  } catch (e: any) {
    console.error("Password reset error:", e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
