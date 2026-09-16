import { NextResponse, NextRequest } from "next/server";
import { getUserByEmail } from "@/lib/services/userStore";
import { generateAndSendPasswordResetToken } from "@/lib/services/otpStore";
import { consumeRateLimit } from "@/lib/services/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // IP Rate limit
    if (!consumeRateLimit(`pw_reset_ip_${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ success: false, message: 'Too many reset requests from this IP. Try again later.' }, { status: 429 });
    }

    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const normEmail = email.trim().toLowerCase();
    
    // We only generate a token if the user actually exists to prevent spam,
    // BUT we always return success to prevent account enumeration.
    const user = getUserByEmail(normEmail);
    if (user) {
      try {
        generateAndSendPasswordResetToken(normEmail);
      } catch (e: any) {
        if (e.status === 429) {
          // Rate limited on this specific email. We still return success to hide this.
        } else {
          console.error("Failed to generate password reset token:", e);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "If an account with that email exists, we have sent a password reset token." 
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
