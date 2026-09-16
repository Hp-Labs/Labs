import { NextResponse, NextRequest } from 'next/server';
import { verifyPassword, getUserById } from '@/lib/services/userStore';
import { createSession } from '@/lib/services/sessionStore';
import { consumeRateLimit } from '@/lib/services/rateLimiter';
import { logSecurityEvent, getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!consumeRateLimit(`admin_login_ip_${ip}`, 10, 15 * 60 * 1000)) {
      logSecurityEvent({ eventType: 'admin_login_ip_bruteforce', ip, severity: 'warn' });
      return NextResponse.json({ success: false, message: 'Too many attempts.' }, { status: 429 });
    }

    const { emailOrUsername, password } = await req.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    const normIdentifier = emailOrUsername.trim().toLowerCase();

    if (!consumeRateLimit(`admin_login_acc_${normIdentifier}`, 5, 15 * 60 * 1000)) {
      logSecurityEvent({ eventType: 'admin_login_acc_bruteforce', details: { identifier: normIdentifier }, ip, severity: 'warn' });
      return NextResponse.json({ success: false, message: 'Too many attempts.' }, { status: 429 });
    }

    await new Promise(r => setTimeout(r, Math.random() * 200 + 100));
    
    const db = getDb();
    const row = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(normIdentifier, normIdentifier) as any;

    if (!row) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const user = getUserById(row.id);

    if (!user || !user.passwordHash || !user.passwordSalt) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // STRICT ADMIN CHECK
    if (user.email !== 'info@hackerplus.in') {
      logSecurityEvent({ eventType: 'normal_user_admin_login_attempt', userId: user.id, ip, severity: 'warn' });
      return NextResponse.json({ success: false, message: 'Unauthorized. This portal is for administrators only.' }, { status: 403 });
    }

    if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      logSecurityEvent({ eventType: 'admin_login_failed_bad_password', userId: user.id, ip, severity: 'warn' });
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const { passwordHash, passwordSalt, ...safeUser } = user;
    
    const isSuperAdmin = user.email === 'info@hackerplus.in';
    
    // MFA Check (Admin always requires MFA, EXCEPT superadmin)
    const sessionUser = { ...safeUser, mfaVerified: isSuperAdmin, loggedInViaAdminPortal: true };
    const sessionToken = createSession(sessionUser);

    const res = NextResponse.json({ 
      success: true, 
      user: sessionUser,
      mfaRequired: !isSuperAdmin 
    });
    
    res.cookies.set('hplabs_session_id', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400 
    });

    logSecurityEvent({ eventType: 'admin_login_mfa_pending', userId: user.id, ip });
    return res;
  } catch (e) {
    console.error('Admin Login Error:', e);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

