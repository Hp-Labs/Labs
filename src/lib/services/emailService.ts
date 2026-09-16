/**
 * HPLabs Email Service
 * ─────────────────────────────────────────────────────────────
 * All transactional emails are sent via Resend.
 * API key is loaded server-side from environment only.
 * Never exposed to browser or logged.
 * 
 * Sender: Hackerplus <noreply@hplabs.in>
 */

import { getDb, logSecurityEvent } from '@/lib/db';
import crypto from 'crypto';

// ── Resend client (server-side only, lazy init) ──────────────

function getResendClient(): import('resend').Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured.");
  const { Resend } = require('resend');
  return new Resend(key);
}

// ── Idempotency ───────────────────────────────────────────────

function checkIdempotency(key: string): boolean {
  try {
    const db = getDb();
    const row = db.prepare("SELECT event_id FROM webhook_idempotency WHERE event_id = ?").get(key);
    if (row) return false; // already sent
    db.prepare("INSERT INTO webhook_idempotency (event_id, processed_at) VALUES (?, ?)").run(key, Date.now());
    return true;
  } catch (e) {
    // If idempotency check fails, allow the email to send (fail open)
    return true;
  }
}

// ── Core sendEmail ────────────────────────────────────────────

export async function sendEmail({
  to,
  subject,
  html,
  idempotencyKey,
  userId,
  eventType,
}: {
  to: string | string[];
  subject: string;
  html: string;
  idempotencyKey?: string;
  userId?: string;
  eventType?: string;
}): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error("[EmailService] RESEND_API_KEY is not configured. Email not sent.");
    return false;
  }

  // Idempotency guard
  if (idempotencyKey && !checkIdempotency(idempotencyKey)) {
    console.log(`[EmailService] Duplicate email suppressed: ${idempotencyKey}`);
    return true; // Already sent
  }

  const fromName = process.env.RESEND_FROM_NAME || 'Hackerplus';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@hplabs.in';
  const from = `${fromName} <${fromEmail}>`;

  try {
    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({ from, to, subject, html });

    if (error) {
      console.error("[EmailService] Resend API Error:", JSON.stringify(error));
      logSecurityEvent({
        eventType: "email_send_error",
        userId,
        details: { subject, eventType: eventType || 'unknown', error: String(error) },
        severity: "warn"
      });
      // Record failed event (non-blocking)
      try {
        const recipient = Array.isArray(to) ? to.join(',') : to;
        getDb().prepare("INSERT INTO email_events (id, user_id, event_type, recipient, subject, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, 'failed', ?, ?)").run(
          crypto.randomUUID(), userId || null, eventType || 'email', recipient, subject, String(error), Date.now()
        );
      } catch {}
      return false;
    }

    // Record successful send
    try {
      const recipient = Array.isArray(to) ? to.join(',') : to;
      getDb().prepare("INSERT INTO email_events (id, user_id, event_type, recipient, subject, status, created_at) VALUES (?, ?, ?, ?, ?, 'sent', ?)").run(
        crypto.randomUUID(), userId || null, eventType || 'email', recipient, subject, Date.now()
      );
    } catch {}

    return true;
  } catch (e: any) {
    console.error("[EmailService] Unexpected error:", e?.message || e);
    return false;
  }
}

// ── Base HTML Template ────────────────────────────────────────

const BASE_TEMPLATE = (content: string, ctaButton?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07040e; color: #e2e8f0; padding: 24px 16px; line-height: 1.6; }
    .container { max-width: 540px; margin: 0 auto; background: #110924; border: 1px solid rgba(191,95,255,0.2); border-radius: 14px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a0f33 0%, #0d0720 100%); padding: 28px 32px; border-bottom: 1px solid rgba(191,95,255,0.15); text-align: center; }
    .logo { font-size: 22px; font-weight: 800; font-family: monospace; color: #ffffff; letter-spacing: 1px; }
    .logo span { color: #bf5fff; }
    .tagline { font-size: 11px; color: #6b7280; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
    .body { padding: 32px; }
    .body p { font-size: 15px; color: #d1d5db; margin-bottom: 16px; }
    .body strong { color: #ffffff; }
    .otp-box { background: rgba(191,95,255,0.08); border: 1px dashed rgba(191,95,255,0.4); border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 32px; font-weight: 700; font-family: monospace; letter-spacing: 6px; color: #bf5fff; }
    .otp-expiry { font-size: 12px; color: #9ca3af; margin-top: 8px; }
    .security-warning { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 12px 16px; margin-top: 16px; font-size: 13px; color: #fca5a5; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #bf5fff); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #6b7280; }
    .info-value { color: #e5e7eb; font-weight: 500; }
    .badge { display: inline-block; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; padding: 3px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge-warn { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: #fcd34d; }
    .badge-danger { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #fca5a5; }
    .footer { background: #0a0515; padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer p { font-size: 11px; color: #4b5563; text-align: center; margin-bottom: 4px; }
    .footer a { color: #7c3aed; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Hp<span>Labs</span></div>
      <div class="tagline">Hack Smarter. Learn Faster.</div>
    </div>
    <div class="body">
      ${content}
      ${ctaButton || ''}
    </div>
    <div class="footer">
      <p>This is an automated message from <strong>HackerPlus Labs</strong>.</p>
      <p>Do not reply to this email. For support, contact <a href="mailto:support@hplabs.in">support@hplabs.in</a></p>
      <p style="margin-top:8px;">© 2026 HackerPlus Labs. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// ── Auth Email Templates ──────────────────────────────────────

export function getOTPVerificationEmail(otp: string): string {
  return BASE_TEMPLATE(`
    <p>You requested email verification for your <strong>HPLabs</strong> account.</p>
    <p>Your one-time verification code is:</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="otp-expiry">⏱ Expires in 10 minutes</div>
    </div>
    <div class="security-warning">
      🔒 <strong>Security Notice:</strong> Never share this code with anyone. HPLabs staff will never ask for your OTP. If you didn't request this, please ignore this email.
    </div>
  `);
}

export function getPasswordResetEmail(resetToken: string): string {
  return BASE_TEMPLATE(`
    <p>A password reset was requested for your <strong>HPLabs</strong> account.</p>
    <p>Your password reset token is:</p>
    <div class="otp-box">
      <div class="otp-code" style="font-size:20px; letter-spacing:3px;">${resetToken}</div>
      <div class="otp-expiry">⏱ Expires in 15 minutes</div>
    </div>
    <p style="font-size:13px;color:#9ca3af;">Enter this token in the reset password form on HPLabs.</p>
    <div class="security-warning">
      🔒 <strong>Security Notice:</strong> If you did not request a password reset, please ignore this email. Your password has not been changed and your account is safe.
    </div>
  `);
}

export function getWelcomeEmail(username: string): string {
  return BASE_TEMPLATE(`
    <p>Welcome to <strong>HackerPlus Labs</strong>, <strong>${username}</strong>! 🎉</p>
    <p>Your account has been verified and activated. You're now ready to start hacking real targets.</p>
    <p>Here's what you can do on HPLabs:</p>
    <p>• Access <strong>200+ real vulnerability labs</strong> across 15+ attack domains</p>
    <p>• Earn <strong>XP</strong> and level up from Script Kiddie to Legend</p>
    <p>• Explore vulnerabilities spanning <strong>56 years</strong> of CVE history</p>
    <p>• Use your own <strong>Kali or Parrot OS</strong> — no browser VMs</p>
  `, '<a href="https://hplabs.in/dashboard" class="cta-button">Start Hacking →</a>');
}

// ── Payment Email Templates ───────────────────────────────────

export function getPaymentSuccessEmail(username: string, plan: string, amount: number, currency: string, expiryDate: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your payment was successful! Your HPLabs subscription is now active.</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Plan</span><span class="info-value">${plan} <span class="badge">ACTIVE</span></span></div>
      <div class="info-row"><span class="info-label">Amount Paid</span><span class="info-value">${currency.toUpperCase()} ${(amount/100).toFixed(2)}</span></div>
      <div class="info-row"><span class="info-label">Access Valid Until</span><span class="info-value">${expiryDate}</span></div>
    </div>
    <p>All premium labs are now unlocked. Happy hacking!</p>
  `, '<a href="https://hplabs.in/labs" class="cta-button">Explore Labs →</a>');
}

export function getInvoiceEmail(username: string, invoiceId: string, plan: string, amount: number, currency: string, date: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Here is your invoice for your HPLabs subscription purchase.</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Invoice ID</span><span class="info-value">${invoiceId}</span></div>
      <div class="info-row"><span class="info-label">Date</span><span class="info-value">${date}</span></div>
      <div class="info-row"><span class="info-label">Description</span><span class="info-value">HPLabs ${plan} Subscription</span></div>
      <div class="info-row"><span class="info-label">Amount</span><span class="info-value">${currency.toUpperCase()} ${(amount/100).toFixed(2)}</span></div>
      <div class="info-row"><span class="info-label">Status</span><span class="info-value"><span class="badge">PAID</span></span></div>
    </div>
    <p style="font-size:13px;color:#9ca3af;">Keep this email for your records. For billing inquiries, contact support@hplabs.in</p>
  `);
}

export function getPaymentFailedEmail(username: string, plan: string, amount: number, currency: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Unfortunately, your payment for the <strong>${plan}</strong> plan could not be processed.</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Plan</span><span class="info-value">${plan}</span></div>
      <div class="info-row"><span class="info-label">Amount</span><span class="info-value">${currency.toUpperCase()} ${(amount/100).toFixed(2)}</span></div>
      <div class="info-row"><span class="info-label">Status</span><span class="info-value"><span class="badge badge-danger">FAILED</span></span></div>
    </div>
    <p>Please check your payment method and try again. Your current access level has not changed.</p>
  `, '<a href="https://hplabs.in/premium" class="cta-button">Try Again →</a>');
}

// ── Subscription Email Templates ──────────────────────────────

export function getSubscriptionActivatedEmail(username: string, plan: string, durationMonths: number, expiryDate: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your HPLabs <strong>${plan}</strong> subscription has been activated!</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Plan</span><span class="info-value">${plan} <span class="badge">ACTIVE</span></span></div>
      <div class="info-row"><span class="info-label">Duration</span><span class="info-value">${durationMonths} month${durationMonths > 1 ? 's' : ''}</span></div>
      <div class="info-row"><span class="info-label">Access Until</span><span class="info-value">${expiryDate}</span></div>
    </div>
    <p>All premium features and labs are now available. Start exploring!</p>
  `, '<a href="https://hplabs.in/labs" class="cta-button">Start Hacking →</a>');
}

export function getSubscriptionRenewedEmail(username: string, plan: string, newExpiryDate: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your HPLabs <strong>${plan}</strong> subscription has been renewed successfully.</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Plan</span><span class="info-value">${plan} <span class="badge">ACTIVE</span></span></div>
      <div class="info-row"><span class="info-label">New Expiry Date</span><span class="info-value">${newExpiryDate}</span></div>
    </div>
    <p>Your premium access continues uninterrupted. Keep hacking!</p>
  `);
}

export function getSubscriptionExpiryReminderEmail(username: string, plan: string, daysRemaining: number, expiryDate: string): string {
  const urgencyClass = daysRemaining <= 1 ? 'badge-danger' : daysRemaining <= 3 ? 'badge-warn' : '';
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your HPLabs <strong>${plan}</strong> subscription will expire in <strong><span class="badge ${urgencyClass}">${daysRemaining} day${daysRemaining === 1 ? '' : 's'}</span></strong>.</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Plan</span><span class="info-value">${plan}</span></div>
      <div class="info-row"><span class="info-label">Expiry Date</span><span class="info-value">${expiryDate}</span></div>
    </div>
    <p>Renew now to maintain uninterrupted access to all premium labs. Your progress and XP are always saved.</p>
  `, '<a href="https://hplabs.in/premium" class="cta-button">Renew Subscription →</a>');
}

export function getSubscriptionExpiredEmail(username: string, plan: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your HPLabs <strong>${plan}</strong> subscription has expired.</p>
    <p>Don't worry — your account, XP, lab history, and progress are all safely preserved.</p>
    <p>You can continue using <strong>FREE tier</strong> labs, or upgrade to regain access to premium features.</p>
  `, '<a href="https://hplabs.in/premium" class="cta-button">View Plans →</a>');
}

// ── Collaboration Email Templates ─────────────────────────────

export function getCollaborationActivatedEmail(username: string, organization: string, plan: string, expiryDate: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your HPLabs access through <strong>${organization}</strong> has been activated!</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Organization</span><span class="info-value">${organization}</span></div>
      <div class="info-row"><span class="info-label">Plan</span><span class="info-value">${plan} <span class="badge">ACTIVE</span></span></div>
      <div class="info-row"><span class="info-label">Access Until</span><span class="info-value">${expiryDate}</span></div>
    </div>
    <p>Start exploring the labs and building your cybersecurity skills!</p>
  `, '<a href="https://hplabs.in/labs" class="cta-button">Start Learning →</a>');
}

export function getCollaborationExpiryReminderEmail(username: string, organization: string, daysRemaining: number, expiryDate: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your sponsored HPLabs access through <strong>${organization}</strong> will expire in <strong>${daysRemaining} day${daysRemaining === 1 ? '' : 's'}</strong>.</p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">Organization</span><span class="info-value">${organization}</span></div>
      <div class="info-row"><span class="info-label">Expiry Date</span><span class="info-value">${expiryDate}</span></div>
    </div>
    <p>Please complete any in-progress labs before your access ends. After expiry, your progress is saved but premium features will be locked.</p>
    <p>You can always continue with a personal subscription to maintain access.</p>
  `, '<a href="https://hplabs.in/premium" class="cta-button">View Personal Plans →</a>');
}

export function getCollaborationExpiredEmail(username: string, organization: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your sponsored HPLabs access through <strong>${organization}</strong> has expired.</p>
    <p>Your account, XP, lab history, and all progress are safely preserved. You can continue on the FREE tier or upgrade to a personal plan.</p>
  `, '<a href="https://hplabs.in/premium" class="cta-button">View Plans →</a>');
}

// ── Backwards compatibility aliases ──────────────────────────

export function getExpiryReminderEmail(username: string, daysRemaining: number): string {
  return getCollaborationExpiryReminderEmail(username, 'your sponsor', daysRemaining, '');
}

export function getExpiredEmail(username: string): string {
  return getCollaborationExpiredEmail(username, 'your sponsor');
}

// ── Security Alert Template ───────────────────────────────────

export function getSecurityAlertEmail(username: string, event: string, ipAddress?: string, timestamp?: string): string {
  return BASE_TEMPLATE(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>A security event was detected on your HPLabs account:</p>
    <div class="otp-box">
      <div style="font-size:16px;font-weight:600;color:#fca5a5;">⚠️ ${event}</div>
    </div>
    <div style="margin: 16px 0;">
      ${ipAddress ? `<div class="info-row"><span class="info-label">IP Address</span><span class="info-value">${ipAddress}</span></div>` : ''}
      ${timestamp ? `<div class="info-row"><span class="info-label">Time</span><span class="info-value">${timestamp}</span></div>` : ''}
    </div>
    <p>If this was not you, please change your password immediately and contact support.</p>
    <div class="security-warning">
      If you recognize this activity, no action is needed. Otherwise, secure your account immediately.
    </div>
  `, '<a href="https://hplabs.in/profile" class="cta-button">Secure My Account →</a>');
}

// ── Lab Completion Template ───────────────────────────────────

export function getLabCompletionEmail(username: string, labName: string, xpAwarded: number, totalXP: number): string {
  return BASE_TEMPLATE(`
    <p>Congratulations, <strong>${username}</strong>! 🏆</p>
    <p>You successfully completed the lab: <strong>${labName}</strong></p>
    <div style="margin: 20px 0;">
      <div class="info-row"><span class="info-label">XP Earned</span><span class="info-value"><span class="badge">+${xpAwarded} XP</span></span></div>
      <div class="info-row"><span class="info-label">Total XP</span><span class="info-value">${totalXP} XP</span></div>
    </div>
    <p>Keep hacking to climb the leaderboard and unlock new tiers!</p>
  `, '<a href="https://hplabs.in/labs" class="cta-button">Next Lab →</a>');
}


