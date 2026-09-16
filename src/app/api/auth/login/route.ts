import { NextResponse, NextRequest } from 'next/server';
import { verifyPassword, getUserById } from '@/lib/services/userStore';
import { consumeRateLimit } from '@/lib/services/rateLimiter';
import { logSecurityEvent, getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!consumeRateLimit(`login_ip_${ip}`, 20, 15 * 60 * 1000)) {
      logSecurityEvent({ eventType: "login_ip_bruteforce", ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Too many login attempts from this IP. Try again in 15 minutes.' }, { status: 429 });
    }

    const body = await req.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password || typeof emailOrUsername !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing or invalid fields' }, { status: 400 });
    }

    const normIdentifier = emailOrUsername.trim().toLowerCase();

    if (!consumeRateLimit(`login_acc_${normIdentifier}`, 5, 15 * 60 * 1000)) {
      logSecurityEvent({ eventType: "login_acc_bruteforce", details: { identifier: normIdentifier }, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Too many failed attempts for this account. Try again in 15 minutes.' }, { status: 429 });
    }

    await new Promise(r => setTimeout(r, Math.random() * 200 + 100));
    
    const db = getDb();
    const row = db.prepare("SELECT id FROM users WHERE email = ? OR username = ?").get(normIdentifier, normIdentifier) as any;

    if (!row) {
      return NextResponse.json({ success: false, message: 'Please create an account first' }, { status: 401 });
    }

    const user = getUserById(row.id);

    if (!user || !user.passwordHash || !user.passwordSalt) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.email === 'info@hackerplus.in' || user.isAdmin) {
      logSecurityEvent({ eventType: "admin_login_attempt_on_public_portal", userId: user.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Admin login is not allowed on the public portal.' }, { status: 403 });
    }

    if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      logSecurityEvent({ eventType: "login_failed_bad_password", userId: user.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.suspended) {
      logSecurityEvent({ eventType: "login_rejected_suspended", userId: user.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Your account has been suspended. Contact support at support@hplabs.in.' }, { status: 403 });
    }

    if (!user.emailVerified && user.email !== 'info@hackerplus.in') {
      logSecurityEvent({ eventType: "login_rejected_unverified_email", userId: user.id, ip, severity: "info" });
      return NextResponse.json({ 
        success: false, 
        message: 'Please verify your email before logging in. Check your inbox for the OTP we sent during registration.',
        requiresVerification: true,
        type: 'registration',
        email: user.email
      }, { status: 403 });
    }

    import('@/lib/services/otpStore').then(({ generateAndStoreLoginOTP }) => {
      generateAndStoreLoginOTP(user.email);
    }).catch(e => console.error("Error generating OTP", e));
    
    return NextResponse.json({ 
      success: true, 
      requiresVerification: true, 
      type: 'login', 
      email: user.email 
    });

  } catch (e) {
    console.error("Login Error:", e);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
