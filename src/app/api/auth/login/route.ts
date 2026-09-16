import { NextResponse, NextRequest } from 'next/server';
import { verifyPassword, getUserById } from '@/lib/services/userStore';
import { createSession } from '@/lib/services/sessionStore';
import { consumeRateLimit } from '@/lib/services/rateLimiter';
import { logSecurityEvent, getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // 1. IP-based brute-force protection
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!consumeRateLimit(`login_ip_${ip}`, 20, 15 * 60 * 1000)) {
      logSecurityEvent({ eventType: "login_ip_bruteforce", ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Too many login attempts from this IP. Try again in 15 minutes.' }, { status: 429 });
    }

    const { emailOrUsername, password } = await req.json();

    if (!emailOrUsername || !password || typeof emailOrUsername !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing or invalid fields' }, { status: 400 });
    }

    const normIdentifier = emailOrUsername.trim().toLowerCase();

    // 2. Account-based brute-force protection
    if (!consumeRateLimit(`login_acc_${normIdentifier}`, 5, 15 * 60 * 1000)) {
      logSecurityEvent({ eventType: "login_acc_bruteforce", details: { identifier: normIdentifier }, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Too many failed attempts for this account. Try again in 15 minutes.' }, { status: 429 });
    }

    // 3. Password Verification
    // Wait for random time to mitigate timing attacks on invalid vs valid users
    await new Promise(r => setTimeout(r, Math.random() * 200 + 100));
    
    const db = getDb();
    const row = db.prepare("SELECT id FROM users WHERE email = ? OR username = ?").get(normIdentifier, normIdentifier) as any;

    if (!row) {
      return NextResponse.json({ success: false, message: 'Please create an account first' }, { status: 401 });
    }

    const user = getUserById(row.id);

    if (!user || !user.passwordHash || !user.passwordSalt) {
      return NextResponse.json({ success: false, message: 'Please create an account first' }, { status: 401 });
    }

    // 3.5 Block admin from normal login portal
    if (user.email === 'info@hackerplus.in' || user.isAdmin) {
      logSecurityEvent({ eventType: "admin_login_attempt_on_public_portal", userId: user.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Admin login is not allowed on the public portal.' }, { status: 403 });
    }

    if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      logSecurityEvent({ eventType: "login_failed_bad_password", userId: user.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Please create an account first' }, { status: 401 });
    }

    // 4. Check if account is suspended
    if (user.suspended) {
      logSecurityEvent({ eventType: "login_rejected_suspended", userId: user.id, ip, severity: "warn" });
      return NextResponse.json({ success: false, message: 'Your account has been suspended. Contact support at support@hplabs.in.' }, { status: 403 });
    }

    // 5. Check email verification (Super Admin is always considered verified)
    if (!user.emailVerified && user.email !== 'info@hackerplus.in') {
      logSecurityEvent({ eventType: "login_rejected_unverified_email", userId: user.id, ip, severity: "info" });
      return NextResponse.json({ 
        success: false, 
        message: 'Please verify your email before logging in. Check your inbox for the OTP we sent during registration.',
        requiresVerification: true
      }, { status: 403 });
    }

    // 6. Secure Session Creation
    const { passwordHash, passwordSalt, ...safeUser } = user;
    
    // MFA Check
    const isSuperAdmin = user.email === 'info@hackerplus.in';
    const mfaRequired = isSuperAdmin || user.mfaEnabled;
    const sessionUser = { ...safeUser, mfaVerified: !mfaRequired };

    // Skip direct session creation. Generate Login OTP.
    import('@/lib/services/otpStore').then(({ generateAndStoreLoginOTP }) => {
      generateAndStoreLoginOTP(user.email);
    });

    return NextResponse.json({ success: true, requiresVerification: true, type: 'login', email: user.email });

    const sessionToken = ''; // Unreachable

    const res = NextResponse.json({ 
      success: true, 
      user: sessionUser,
      mfaRequired 
    });
    
    res.cookies.set('hplabs_session_id', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400 // 24 hours
    });

    if (mfaRequired) {
      logSecurityEvent({ eventType: "login_mfa_pending", userId: user.id, ip });
    } else {
      logSecurityEvent({ eventType: "login_success", userId: user.id, ip });
    }
    
    return res;
  } catch (e) {
    console.error("Login Error:", e);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

