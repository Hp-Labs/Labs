// ============================================================
// HpLabs - Partner OTP + Session Store (server-side only, in-memory)
//
// Two tables:
//   otpTable   : email -> { codeHash, expiresAt, attempts }
//   sessionTable: token -> { email, entitledPremiumMonths, course, duration, expiresAt }
//
// OTPs expire after 10 minutes.
// Verified sessions expire after 15 minutes.
// ============================================================

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const OTP_TTL_MS     = 10 * 60 * 1000; // 10 min
const SESSION_TTL_MS = 15 * 60 * 1000; // 15 min
const MAX_OTP_ATTEMPTS = 5;

interface OtpEntry {
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

interface PartnerSession {
  email: string;
  course: string;
  duration: string;
  entitledPremiumMonths: number;
  matchedRuleLabel: string | null;
  expiresAt: number;
  used: boolean;
}

// Simple in-memory maps
const otpTable     = new Map<string, OtpEntry>();
const sessionTable = new Map<string, PartnerSession>();

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

// Dispatch to mock out-of-band box for testing
function dispatchMockOTP(email: string, code: string) {
  try {
    const mockBoxPath = path.join(process.cwd(), 'scratch', 'mock-mailbox.json');
    let box: any = {};
    if (fs.existsSync(mockBoxPath)) {
      box = JSON.parse(fs.readFileSync(mockBoxPath, 'utf8'));
    }
    box[email] = { partnerOTP: code, time: Date.now() };
    if (!fs.existsSync(path.dirname(mockBoxPath))) {
      fs.mkdirSync(path.dirname(mockBoxPath), { recursive: true });
    }
    fs.writeFileSync(mockBoxPath, JSON.stringify(box, null, 2));
  } catch (e) {
    // ignore
  }
}

/** Generate and store a secure alphanumeric OTP for an email. Returns nothing directly to prevent exposure. */
export function createPartnerOtp(email: string): void {
  const code = generateSecureAlphanumericOTP(8);
  const codeHash = hashOTP(code);
  otpTable.set(email.toLowerCase(), {
    codeHash,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
  dispatchMockOTP(email.toLowerCase(), code);
}

export type OtpVerifyResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" | "too_many_attempts" };

/** Verify an OTP code. Increments attempt counter. */
export function verifyPartnerOtp(email: string, code: string): OtpVerifyResult {
  const key = email.toLowerCase();
  const entry = otpTable.get(key);

  if (!entry) return { ok: false, reason: "invalid" };
  if (Date.now() > entry.expiresAt) {
    otpTable.delete(key);
    return { ok: false, reason: "expired" };
  }
  if (entry.attempts >= MAX_OTP_ATTEMPTS) {
    otpTable.delete(key);
    return { ok: false, reason: "too_many_attempts" };
  }

  entry.attempts += 1;

  const inputHash = hashOTP(code.trim());
  if (!timingSafeCompare(entry.codeHash, inputHash)) {
    return { ok: false, reason: "invalid" };
  }

  // Correct - consume OTP
  otpTable.delete(key);
  return { ok: true };
}

// Session helpers

/** Create a verified session after successful OTP. Returns opaque token. */
export function createPartnerSession(
  email: string,
  course: string,
  duration: string,
  entitledPremiumMonths: number,
  matchedRuleLabel: string | null,
): string {
  const token = `PST-${Date.now()}-${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
  sessionTable.set(token, {
    email: email.toLowerCase(),
    course,
    duration,
    entitledPremiumMonths,
    matchedRuleLabel,
    expiresAt: Date.now() + SESSION_TTL_MS,
    used: false,
  });
  return token;
}

/** Look up a valid, unused session. Returns null if expired/used/not found. */
export function getPartnerSession(token: string): PartnerSession | null {
  const session = sessionTable.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessionTable.delete(token);
    return null;
  }
  if (session.used) return null;
  return session;
}

/** Mark session as consumed (one-time use). */
export function consumePartnerSession(token: string): void {
  const session = sessionTable.get(token);
  if (session) session.used = true;
}

