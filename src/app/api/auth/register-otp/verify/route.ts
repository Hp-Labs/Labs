import { NextResponse } from "next/server";
import { verifyRegistrationOTPs } from "@/lib/services/otpStore";
import { consumeRateLimit } from "@/lib/services/rateLimiter";
import { getUserByEmail, updateUser } from "@/lib/services/userStore";
import { createSession } from "@/lib/services/sessionStore";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limit OTP verify attempts
    if (!consumeRateLimit(`otp_verify_${ip}`, 20, 15 * 60 * 1000)) {
      return NextResponse.json({ success: false, message: "Too many attempts. Try again later." }, { status: 429 });
    }

    const { email, emailOTP, phoneOTP } = await req.json();
    
    if (!email || !emailOTP) {
      return NextResponse.json({ success: false, message: "Email and emailOTP are required." }, { status: 400 });
    }

    const normEmail = email.trim().toLowerCase();

    // Verify OTP first
    const isValid = verifyRegistrationOTPs(normEmail, emailOTP, phoneOTP || null);
    
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP. Please try again." }, { status: 400 });
    }

    // Now mark the user as verified
    const user = getUserByEmail(normEmail);
    if (!user) {
      return NextResponse.json({ success: false, message: "Account not found." }, { status: 404 });
    }

    updateUser(user.id, { emailVerified: true });

    // Build safe user object for session
    const verifiedUser = { ...user, emailVerified: true };
    delete (verifiedUser as any).passwordHash;
    delete (verifiedUser as any).passwordSalt;
    
    // Check for automatic collaboration activations
    try {
      const { checkAndActivateStudent } = require('@/lib/services/collaborationStore');
      checkAndActivateStudent(normEmail, user.id);
      
      // Update verifiedUser plan if it changed during activation
      const updatedUser = getUserByEmail(normEmail);
      if (updatedUser) {
        verifiedUser.plan = updatedUser.plan;
        verifiedUser.premiumUntil = updatedUser.premiumUntil;
      }
    } catch (err) {
      console.error("Failed to process automatic collaboration matching:", err);
    }
    
    const sessionToken = createSession(verifiedUser);

    // Send welcome email asynchronously
    import('@/lib/services/emailService').then(({ sendEmail, getWelcomeEmail }) => {
      sendEmail({
        to: normEmail,
        subject: 'Welcome to HackerPlus Labs!',
        html: getWelcomeEmail(user.username),
        idempotencyKey: `welcome_${user.id}`,
        userId: user.id,
        eventType: 'welcome'
      });
    }).catch(() => {});

    const res = NextResponse.json({ success: true, message: "Verification successful.", user: verifiedUser });
    res.cookies.set('hplabs_session_id', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400 // 24 hours
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Failed to verify OTP." }, { status: e.status || 400 });
  }
}

