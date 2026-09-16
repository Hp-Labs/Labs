import { NextResponse, NextRequest } from "next/server";
import { generateAndStoreRegistrationOTPs } from "@/lib/services/otpStore";
import { consumeRateLimit } from "@/lib/services/rateLimiter";
import { getUserByEmail } from "@/lib/services/userStore";

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 
  'temp-mail.org', 'yopmail.com', 'throwawaymail.com',
  'sharklasers.com', 'trashmail.com', 'dispostable.com',
  'tempmail.com', 'maildrop.cc', 'fakeinbox.com', 'trashmail.me',
  'spam4.me', 'binkmail.com', 'suremail.info', 'discardmail.com',
  'tempr.email', 'throwam.com', 'getairmail.com', 'getnada.com',
  'mailnull.com', 'spamgourmet.com', 'trashmail.at', 'trashmail.io',
]);

function isValidEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const domain = email.split('@')[1].toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // IP Rate limit: max 5 OTP requests per hour per IP
    if (!consumeRateLimit(`otp_ip_${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ success: false, message: 'Too many OTP requests from this IP. Try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { email, phone } = body;
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const normEmail = email.trim().toLowerCase();
    
    if (normEmail.length > 255 || !isValidEmail(normEmail)) {
      return NextResponse.json({ success: false, message: 'Invalid or disposable email address' }, { status: 400 });
    }

    if (normEmail === 'info@hackerplus.in') {
      return NextResponse.json({ success: false, message: 'Registration for this email is blocked.' }, { status: 403 });
    }

    // Prevent sending OTP to already verified emails
    const user = getUserByEmail(normEmail);
    if (user && user.emailVerified) {
      return NextResponse.json({ success: false, message: 'An account with this email is already verified. Please log in.' }, { status: 400 });
    }

    // Generate and send OTP (phone is optional)
    generateAndStoreRegistrationOTPs(normEmail, phone ? phone.trim() : undefined);
    
    return NextResponse.json({ 
      success: true, 
      message: "Verification code sent to your email. Check your inbox.",
      phoneRequired: !!phone
    });
  } catch (e: any) {
    if (e.status === 429) {
      return NextResponse.json({ success: false, message: e.message }, { status: 429 });
    }
    return NextResponse.json({ success: false, message: e.message || "Failed to generate OTP." }, { status: e.status || 400 });
  }
}