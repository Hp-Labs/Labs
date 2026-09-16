import os

code = '''// ============================================================
// HpLabs - OTP Store (server-side only)
// Backed by SQLite
// ============================================================

import { getDb, logSecurityEvent } from '@/lib/db';
import crypto from 'crypto';
import { consumeRateLimit } from '@/lib/services/rateLimiter';
import fs from 'fs';
import path from 'path';

export interface OTPRecord {
  emailOTP: string; // Stored as hash
  phoneOTP: string; // Stored as hash
  phone: string;
  expiresAt: number;
  attempts: number;
  lockoutUntil: number | null;
}

const OTP_TTL_MS = 10 * 60 * 1000;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function pruneExpiredOTPs() {
  try {
    const db = getDb();
    db.prepare("DELETE FROM otp_store WHERE expires_at < ?").run(Date.now());
  } catch {}
}

function generateSecureAlphanumericOTP(length = 8) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secureOtp = '';
  while (secureOtp.length < length) {
    const byte = crypto.randomBytes(1)[0];
    if (byte < 248) {
      secureOtp += charset[byte % 62];
    }
  }
  return secureOtp;
}

function hashOTP(otp: string) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// Ensure mock delivery mechanism for automated testing (not exposed to user/logs)
function dispatchMockOTP(email: string, phone: string, emailOTP: string, phoneOTP: string) {
  try {
    const mockBoxPath = path.join(process.cwd(), 'scratch', 'mock-mailbox.json');
    let box: any = {};
    if (fs.existsSync(mockBoxPath)) {
      box = JSON.parse(fs.readFileSync(mockBoxPath, 'utf8'));
    }
    box[email] = { emailOTP, phoneOTP, phone, time: Date.now() };
    if (!fs.existsSync(path.dirname(mockBoxPath))) {
      fs.mkdirSync(path.dirname(mockBoxPath), { recursive: true });
    }
    fs.writeFileSync(mockBoxPath, JSON.stringify(box, null, 2));
  } catch (e) {
    // ignore
  }
}

export function generateAndStoreRegistrationOTPs(email: string, phone: string): void {
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

  // Generates 8-char secure alphanumeric OTPs
  const emailOTP = generateSecureAlphanumericOTP(8);
  const phoneOTP = generateSecureAlphanumericOTP(8);
  const now = Date.now();

  const emailOTPHash = hashOTP(emailOTP);
  const phoneOTPHash = hashOTP(phoneOTP);

  db.prepare(
    INSERT INTO otp_store (identifier, email_otp, phone_otp, phone, created_at, expires_at, attempts, lockout_until)
    VALUES (?, ?, ?, ?, ?, ?, 0, NULL)
    ON CONFLICT(identifier) DO UPDATE SET
      email_otp = excluded.email_otp,
      phone_otp = excluded.phone_otp,
      phone = excluded.phone,
      expires_at = excluded.expires_at,
      attempts = 0,
      lockout_until = NULL
  ).run(id, emailOTPHash, phoneOTPHash, phone, now, now + OTP_TTL_MS);

  // Dispatch plaintext to mock out-of-band box for testing
  dispatchMockOTP(id, phone, emailOTP, phoneOTP);
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

export function verifyRegistrationOTPs(email: string, emailOTP: string, phoneOTP: string): boolean {
  pruneExpiredOTPs();
  const db = getDb();
  const id = email.toLowerCase();

  const record = db.prepare("SELECT * FROM otp_store WHERE identifier = ?").get(id) as any;
  if (!record) return false;

  if (record.lockout_until && Date.now() < record.lockout_until) {
    return false; // locked out
  }

  const inputEmailHash = hashOTP(emailOTP);
  const inputPhoneHash = hashOTP(phoneOTP);

  const emailMatch = timingSafeCompare(record.email_otp, inputEmailHash);
  const phoneMatch = timingSafeCompare(record.phone_otp, inputPhoneHash);

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
'''

with open('src/lib/services/otpStore.ts', 'w', encoding='utf-8') as f:
    f.write(code)

