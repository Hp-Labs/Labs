import { NextResponse, NextRequest } from 'next/server';
import { getUserByEmail } from '@/lib/services/userStore';
import { getDb, logSecurityEvent } from '@/lib/db';
import { createSession } from '@/lib/services/sessionStore';
import crypto from 'crypto';

function hashOTP(otp: string) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}
function timingSafeCompare(a: string, b: string) {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });

    const normEmail = email.toLowerCase().trim();
    const db = getDb();
    
    // Check if OTP exists
    const record = db.prepare("SELECT * FROM otp_store WHERE identifier = ?").get('login_' + normEmail) as any;
    if (!record) return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
    
    // Check lockout
    if (record.lockout_until && Date.now() < record.lockout_until) {
      return NextResponse.json({ success: false, message: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const inputHash = hashOTP(otp);
    if (!timingSafeCompare(record.email_otp, inputHash)) {
      const attempts = record.attempts + 1;
      if (attempts >= 5) {
        db.prepare("UPDATE otp_store SET attempts = ?, lockout_until = ? WHERE identifier = ?").run(attempts, Date.now() + 15 * 60 * 1000, 'login_' + normEmail);
      } else {
        db.prepare("UPDATE otp_store SET attempts = ? WHERE identifier = ?").run(attempts, 'login_' + normEmail);
      }
      return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
    }

    // OTP Valid - Issue Session
    db.prepare("DELETE FROM otp_store WHERE identifier = ?").run('login_' + normEmail);

    const user = getUserByEmail(normEmail);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    const { passwordHash, passwordSalt, ...safeUser } = user;
    const sessionUser = { ...safeUser, mfaVerified: true };
    const sessionToken = createSession(sessionUser);

    const res = NextResponse.json({ success: true, user: sessionUser });
    res.cookies.set('hplabs_session_id', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400
    });
    
    logSecurityEvent({ eventType: "login_success_otp", userId: user.id });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
