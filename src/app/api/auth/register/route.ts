import { NextResponse, NextRequest } from 'next/server';
import { createUser, getUserByEmail, updateUser } from '@/lib/services/userStore';
import { verifyRegistrationOTPs } from '@/lib/services/otpStore';
import { createSession } from '@/lib/services/sessionStore';
import { consumeRateLimit } from '@/lib/services/rateLimiter';
import crypto from 'crypto';

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 
  'temp-mail.org', 'yopmail.com', 'throwawaymail.com',
  'sharklasers.com', 'trashmail.com', 'dispostable.com',
  'tempmail.com', 'maildrop.cc', 'fakeinbox.com', 'trashmail.me',
  'spam4.me', 'binkmail.com', 'suremail.info', 'discardmail.com',
  'tempr.email', 'throwam.com', 'getairmail.com', 'getnada.com',
  'mailnull.com', 'spamgourmet.com', 'trashmail.at', 'trashmail.io',
  'spamhereplease.com', 'tempinbox.com', 'spamex.com', 'deadaddress.com',
]);

function isValidEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const domain = email.split('@')[1].toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) return false;
  return true;
}

function isValidUsername(username: string) {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username);
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!consumeRateLimit(`register_ip_${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ success: false, message: 'Too many registration attempts from this IP' }, { status: 429 });
    }

    // Parse body once
    const body = await req.json();
    const { username, email, password, phone } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing required fields (username, email, password)' }, { status: 400 });
    }

    // 2. Normalization & Length Validation
    const normEmail = email.trim().toLowerCase();
    const normUsername = username.trim();
    const normPhone = phone ? phone.trim() : "";

    if (normEmail.length > 255 || !isValidEmail(normEmail)) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
      return NextResponse.json({ success: false, message: 'Temporary emails are not allowed' }, { status: 400 });
    }
    if (normEmail === 'info@hackerplus.in') {
      return NextResponse.json({ success: false, message: 'Registration for this email is blocked' }, { status: 403 });
    }
    if (normUsername.length < 3 || normUsername.length > 30 || !isValidUsername(normUsername)) {
      return NextResponse.json({ success: false, message: 'Username must be 3-30 alphanumeric characters or underscores' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ success: false, message: 'Password must be between 8 and 128 characters' }, { status: 400 });
    }

    // 3. Database Uniqueness Check
    if (getUserByEmail(normEmail)) {
      return NextResponse.json({ success: false, message: 'Account already created, please login' }, { status: 400 });
    }

    // 3.5 Phone Number Limit Check
    if (normPhone) {
      const db = require('@/lib/db').getDb();
      const row = db.prepare('SELECT count(*) as count FROM users WHERE phone = ?').get(normPhone);
      if (row && row.count >= 3) {
        return NextResponse.json({ success: false, message: 'Maximum 3 accounts are allowed per phone number' }, { status: 400 });
      }
    }

    // 4. Create Unverified User
    const userId = "HP-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    createUser({
      id: userId,
      username: normUsername,
      email: normEmail,
      phone: normPhone || undefined,
      xp: 0,
      completedLabs: []
    }, password);

    // email_verified defaults to 0 in DB

    // 5. Generate and Send OTP
    import('@/lib/services/otpStore').then(({ generateAndStoreRegistrationOTPs }) => {
      generateAndStoreRegistrationOTPs(normEmail, normPhone || undefined);
    }).catch(e => console.error("Failed to generate OTP:", e));

    return NextResponse.json({ 
      success: true, 
      message: 'Account created. Please check your email for the verification code.',
      requiresVerification: true
    });
  } catch (e: any) {
    console.error("Register Error:", e);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

