// ============================================================
// HpLabs - OTP Store (server-side only)
// Backed by SQLite
// ============================================================

import { getDb, logSecurityEvent } from '@/lib/db';
import crypto from 'crypto';
import { consumeRateLimit } from '@/lib/services/rateLimiter';

export interface OTPRecord {
  emailOTP: string; // Stored as hash
  phoneOTP: string; // Stored as hash (may be empty if phone not provided)
  phone: string;
  expiresAt: number;
  attempts: number;
  lockoutUntil: number | null;
}

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function pruneExpiredOTPs() {
  try {
    const db = getDb();
    db.prepare("DELETE FROM otp_store WHERE expires_at < ?").run(Date.now());
  } catch {}
}

function generateSecureAlphanumericOTP(length = 8) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0,O,I,1)
  let secureOtp = '';
  while (secureOtp.length < length) {
    const byte = crypto.randomBytes(1)[0];
    if (byte < 256 - (256 % charset.length)) {
      secureOtp += charset[byte % charset.length];
    }
  }
  return secureOtp;
}

function hashOTP(otp: string) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function timingSafeCompare(a: string, b: string) {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ── Registration OTP ─────────────────────────────────────────

export function generateAndStoreRegistrationOTPs(email: string, phone?: string): { emailOTP: string, phoneOTP: string } {
  if (!consumeRateLimit('otp_generate_' + email.toLowerCase(), 3, 15 * 60 * 1000)) {
    const err: any = new Error('Rate limit exceeded. Please wait before requesting another OTP.');
    err.status = 429;
    throw err;
  }
  pruneExpiredOTPs();
  const db = getDb();
  const id = email.toLowerCase();

  const current = db.prepare("SELECT attempts, lockout_until FROM otp_store WHERE identifier = ?").get(id) as any;
  if (current && current.lockout_until && Date.now() < current.lockout_until) {
    const err: any = new Error("Too many failed attempts. Try again later.");
    err.status = 429;
    throw err;
  }

  // Generate 8-char secure alphanumeric OTPs
  const emailOTP = generateSecureAlphanumericOTP(8);
  const phoneOTP = phone ? generateSecureAlphanumericOTP(8) : '';
  const now = Date.now();

  const emailOTPHash = hashOTP(emailOTP);
  const phoneOTPHash = phone ? hashOTP(phoneOTP) : '';

  db.prepare(`
    INSERT INTO otp_store (identifier, email_otp, phone_otp, phone, created_at, expires_at, attempts, lockout_until)
    VALUES (?, ?, ?, ?, ?, ?, 0, NULL)
    ON CONFLICT(identifier) DO UPDATE SET
      email_otp = excluded.email_otp,
      phone_otp = excluded.phone_otp,
      phone = excluded.phone,
      expires_at = excluded.expires_at,
      attempts = 0,
      lockout_until = NULL
  `).run(id, emailOTPHash, phoneOTPHash, phone || '', now, now + OTP_TTL_MS);

  // Send the actual OTP via EmailService (non-blocking)
  import('@/lib/services/emailService').then(({ sendEmail, getOTPVerificationEmail }) => {
    sendEmail({
      to: email,
      subject: 'HPLabs - Your Verification Code',
      html: getOTPVerificationEmail(emailOTP),
      idempotencyKey: `otp_${id}_${now}`
    });
  }).catch(e => console.error("Failed to send OTP email:", e));

  return { emailOTP, phoneOTP };
}

export function verifyRegistrationOTPs(email: string, emailOTP: string, phoneOTP?: string | null): boolean {
  pruneExpiredOTPs();
  const db = getDb();
  const id = email.toLowerCase();

  const record = db.prepare("SELECT * FROM otp_store WHERE identifier = ?").get(id) as any;
  if (!record) return false;

  if (record.lockout_until && Date.now() < record.lockout_until) {
    return false; // locked out
  }

  const inputEmailHash = hashOTP(emailOTP);
  const emailMatch = timingSafeCompare(record.email_otp, inputEmailHash);

  // Phone OTP is only checked if phone was provided during OTP generation
  let phoneMatch = true;
  if (record.phone_otp && record.phone_otp !== '' && phoneOTP) {
    const inputPhoneHash = hashOTP(phoneOTP);
    phoneMatch = timingSafeCompare(record.phone_otp, inputPhoneHash);
  }

  if (emailMatch && phoneMatch) {
    db.prepare("DELETE FROM otp_store WHERE identifier = ?").run(id);
    return true;
  }

  // Handle failure
  const attempts = record.attempts + 1;
  let lockout = null;
  if (attempts >= MAX_ATTEMPTS) {
    lockout = Date.now() + LOCKOUT_DURATION_MS;
    logSecurityEvent({
      eventType: "otp_bruteforce_lockout",
      details: { email }
    });
  }

  db.prepare("UPDATE otp_store SET attempts = ?, lockout_until = ? WHERE identifier = ?")
    .run(attempts, lockout, id);

  return false;
}

// ── Password Reset Token ─────────────────────────────────────

export function generateAndSendPasswordResetToken(email: string): void {
  if (!consumeRateLimit('pw_reset_' + email.toLowerCase(), 3, 15 * 60 * 1000)) {
    const err: any = new Error('Rate limit exceeded. Please wait before requesting another reset.');
    err.status = 429;
    throw err;
  }
  pruneExpiredOTPs();
  const db = getDb();
  const id = "pwreset_" + email.toLowerCase();

  const resetToken = generateSecureAlphanumericOTP(12); // 12-char alphanumeric token  
  const tokenHash = hashOTP(resetToken);
  const now = Date.now();
  const expiresAt = now + 15 * 60 * 1000; // 15 mins

  db.prepare(`
    INSERT INTO otp_store (identifier, email_otp, phone_otp, phone, created_at, expires_at, attempts, lockout_until)
    VALUES (?, ?, '', '', ?, ?, 0, NULL)
    ON CONFLICT(identifier) DO UPDATE SET
      email_otp = excluded.email_otp,
      expires_at = excluded.expires_at,
      attempts = 0,
      lockout_until = NULL
  `).run(id, tokenHash, now, expiresAt);

  // Send password reset email via EmailService
  import('@/lib/services/emailService').then(({ sendEmail, getPasswordResetEmail }) => {
    sendEmail({
      to: email,
      subject: 'HPLabs - Password Reset Token',
      html: getPasswordResetEmail(resetToken),
      idempotencyKey: `pwreset_${id}_${now}`
    });
  }).catch(e => console.error("Failed to send password reset email:", e));
}

export function verifyAndDeletePasswordResetToken(email: string, token: string): boolean {
  pruneExpiredOTPs();
  const db = getDb();
  const id = "pwreset_" + email.toLowerCase();
  
  const record = db.prepare("SELECT * FROM otp_store WHERE identifier = ?").get(id) as any;
  if (!record) return false;
  if (record.lockout_until && Date.now() < record.lockout_until) return false;

  const inputHash = hashOTP(token);
  if (timingSafeCompare(record.email_otp, inputHash)) {
    db.prepare("DELETE FROM otp_store WHERE identifier = ?").run(id);
    return true;
  }

  const attempts = record.attempts + 1;
  let lockout = null;
  if (attempts >= MAX_ATTEMPTS) {
    lockout = Date.now() + LOCKOUT_DURATION_MS;
    logSecurityEvent({ eventType: "pwreset_bruteforce", details: { email } });
  }
  db.prepare("UPDATE otp_store SET attempts = ?, lockout_until = ? WHERE identifier = ?").run(attempts, lockout, id);
  return false;
}

export function getOTPRecord(email: string): OTPRecord | null {
  const db = getDb();
  const record = db.prepare("SELECT * FROM otp_store WHERE identifier = ?").get(email.toLowerCase()) as any;
  if (!record) return null;
  return {
    emailOTP: record.email_otp,
    phoneOTP: record.phone_otp,
    phone: record.phone,
    expiresAt: record.expires_at,
    attempts: record.attempts,
    lockoutUntil: record.lockout_until,
  };
}

export function deleteOTPRecord(email: string): void {
  const db = getDb();
  db.prepare("DELETE FROM otp_store WHERE identifier = ?").run(email.toLowerCase());
}
export function generateAndStoreLoginOTP(email: string): string {
  pruneExpiredOTPs();
  const db = getDb();
  const id = 'login_' + email.toLowerCase();
  const emailOTP = generateSecureAlphanumericOTP(6);
  const emailOTPHash = hashOTP(emailOTP);
  const now = Date.now();
  
  db.prepare(
      INSERT OR REPLACE INTO otp_store (identifier, email_otp, phone_otp, phone, created_at, expires_at, attempts, lockout_until)
      VALUES (?, ?, ?, ?, ?, ?, 0, NULL)
  ).run(id, emailOTPHash, '', '', now, now + OTP_TTL_MS);

  import('@/lib/services/emailService').then(({ sendEmail, getOTPVerificationEmail }) => {
    sendEmail({
      to: email,
      subject: 'HPLabs - Your Login Verification Code',
      html: getOTPVerificationEmail(emailOTP),
      idempotencyKey: "loginotp_\_\"
    });
  }).catch(e => console.error("Failed to send login OTP email:", e));

  return emailOTP;
}
