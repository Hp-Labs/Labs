import type { SupportTicket } from "./ticketStore";

//  Environment-driven config 
// Wire up real providers by setting these env vars:
//   SUPPORT_EMAIL          e.g. support@hackerplus.in
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS   (for nodemailer)
//   WHATSAPP_API_URL       e.g. your WhatsApp Business API endpoint
//   WHATSAPP_API_TOKEN     Bearer token
//   WHATSAPP_TO_NUMBER     e.g. +91XXXXXXXXXX (team number)

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@hackerplus.in";
const SECURITY_EMAIL = process.env.SECURITY_EMAIL ?? "security@hackerplus.in";
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL ?? "";
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN ?? "";
const WHATSAPP_TO_NUMBER = process.env.WHATSAPP_TO_NUMBER ?? "+91 83097 29774";
const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";

//  Email body builder 
function buildEmailBody(ticket: SupportTicket): string {
  return `
===== HPLabs Support Ticket =====

Ticket ID   : ${ticket.ticketId}
Status      : ${ticket.status.toUpperCase()}
Created     : ${ticket.createdAt}

 User Details 
User ID     : ${ticket.userId}
Name        : ${ticket.name}
Email       : ${ticket.email}
Phone       : ${ticket.phone}

 Issue 
${ticket.issueDescription}

 Context 
Lab ID      : ${ticket.labId ?? "N/A"}
Session ID  : ${ticket.sessionId ?? "N/A"}
Error Code  : ${ticket.errorCode ?? "N/A"}

 System Diagnostics 
Timestamp   : ${ticket.systemDiagnostics.timestamp}
User Agent  : ${ticket.systemDiagnostics.userAgent ?? "N/A"}
Server XP   : ${ticket.systemDiagnostics.serverXP ?? "N/A"}
Labs Done   : ${ticket.systemDiagnostics.serverLabsCompleted ?? "N/A"}

 Remediation Already Attempted 
${ticket.remediationAttempts.length > 0 ? ticket.remediationAttempts.map((r, i) => `${i + 1}. ${r}`).join("\n") : "None"}

==================================
Respond to this user at: ${ticket.email}
`.trim();
}

//  WhatsApp short summary 
function buildWhatsAppMessage(ticket: SupportTicket): string {
  return (
    ` *New Support Ticket*\n` +
    `*ID:* ${ticket.ticketId}\n` +
    `*User:* ${ticket.name} (${ticket.email})\n` +
    `*Issue:* ${ticket.issueDescription.slice(0, 180)}${ticket.issueDescription.length > 180 ? "" : ""}\n` +
    `*Lab:* ${ticket.labId ?? "N/A"}\n` +
    `*Error:* ${ticket.errorCode ?? "N/A"}\n` +
    `*Time:* ${ticket.createdAt}`
  );
}

//  Email dispatcher 
async function sendEmail(to: string, subject: string, body: string): Promise<"sent" | "failed" | "not-configured"> {
  const isDev = process.env.NODE_ENV !== "production";

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // Dev/unconfigured mode  log full email to server console for inspection
    console.log(`\n${"=".repeat(60)}`);
    console.log(`[NotificationService EMAIL - ${isDev ? "DEV" : "UNCONFIGURED"}]`);
    console.log(`To: ${to} | Subject: ${subject}`);
    console.log(body);
    console.log("=".repeat(60) + "\n");
    return "not-configured";
  }

  // Production: POST to a self-hosted or third-party SMTP relay endpoint
  // Wire SMTP_RELAY_URL to your own relay (e.g. a Nodemailer microservice, Mailgun, Resend, etc.)
  // This avoids bundling server-only libs into the Next.js edge runtime.
  const SMTP_RELAY_URL = process.env.SMTP_RELAY_URL ?? "";
  if (!SMTP_RELAY_URL) {
    console.warn("[NotificationService] SMTP_RELAY_URL not set  email not sent. Configure it to enable email delivery.");
    return "not-configured";
  }

  try {
    const res = await fetch(SMTP_RELAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SMTP_PASS}`,
      },
      body: JSON.stringify({ to, from: SMTP_USER, subject, text: body }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[NotificationService] Email relay error:", err);
      return "failed";
    } else {
      console.log(`[NotificationService] Email sent to ${to}`); return "sent";
    }
  } catch (e: any) {
    console.error("[NotificationService] Email error:", e?.message); return "not-configured";
  }
}

//  WhatsApp dispatcher 
async function sendWhatsApp(message: string): Promise<"sent" | "failed" | "not-configured"> {
  if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !WHATSAPP_TO_NUMBER) {
    // Dev mode  log to server console
    console.log(`\n[NotificationService WHATSAPP]\n${message}\n`);
    return "not-configured";
  }

  try {
    // WhatsApp Business Cloud API (Meta) format  adjust payload to your provider
    const payload = {
      messaging_product: "whatsapp",
      to: WHATSAPP_TO_NUMBER,
      type: "text",
      text: { body: message },
    };
    const res = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[NotificationService] WhatsApp error:", err);
      return "failed";
    } else {
      console.log("[NotificationService] WhatsApp notification sent"); return "sent";
    }
  } catch (e: any) {
    console.error("[NotificationService] WhatsApp fetch error:", e?.message); return "not-configured";
  }
}

//  Main export 
export async function notifySupportTeam(ticket: SupportTicket, isSecurityReport = false): Promise<{ email: "sent"|"failed"|"not-configured", whatsapp: "sent"|"failed"|"not-configured" }> {
  const emailBody = buildEmailBody(ticket);
  const whatsAppMsg = buildWhatsAppMessage(ticket);

  const results = await Promise.all([
    sendEmail(
      isSecurityReport ? SECURITY_EMAIL : SUPPORT_EMAIL,
      `[HPLabs] New Support Ticket ${ticket.ticketId}  ${ticket.email}`,
      emailBody
    ),
    sendWhatsApp(whatsAppMsg),
  ]);
  return { email: results[0], whatsapp: results[1] };
}

// User confirmation email
export async function notifyUserTicketCreated(ticket: SupportTicket): Promise<"sent" | "failed" | "not-configured"> {
  const body = `
Hi ${ticket.name},

Your support ticket has been submitted successfully.

Ticket ID  : ${ticket.ticketId}
Status     : Open  Under Review
Issue      : ${ticket.issueDescription.slice(0, 200)}

Our team will review your ticket and respond to ${ticket.email} within 24 hours.

If you need to provide additional information, reply to this email and include your Ticket ID: ${ticket.ticketId}

 HpLabs Support Team
  support@hackerplus.in
  `.trim();

  return await sendEmail(
    ticket.email,
    `[HPLabs] Support Ticket ${ticket.ticketId} Received`,
    body
  );
}

//  Security event notification 
export interface SecurityEventNotification {
  id: string;
  type: string;
  title: string;
  severity: string;
  affectedTechnology: string[];
  cwe?: string[];
  cve?: string[];
  shortExplanation: string;
  hplabsAvailability: string;
  detectedAt: string;
}

export async function notifySecurityEvent(event: SecurityEventNotification): Promise<{ email: "sent"|"failed"|"not-configured", whatsapp: "sent"|"failed"|"not-configured" }> {
  const isLab = event.type === "new_lab";
  const subject = isLab
    ? `[HPLabs] New Lab Published: ${event.title}`
    : `[HPLabs] New Verified Security Advisory: ${event.title}`;

  const emailBody = `
===== HPLabs Security Monitor =====

Event Type  : ${event.type.replace(/_/g, " ").toUpperCase()}
Title       : ${event.title}
Severity    : ${event.severity}
Detected    : ${event.detectedAt}

 Affected Technology 
${event.affectedTechnology.join(", ")}

 CWE 
${event.cwe?.join(", ") ?? "N/A"}

 CVE 
${event.cve?.join(", ") ?? "N/A"}

 Summary 
${event.shortExplanation}

 HPLabs Availability 
${event.hplabsAvailability === "available" ? " Lab available now on HPLabs" : " Lab coming soon"}

===================================
View on HPLabs: https://hpvuln.in
`.trim();

  const whatsAppMsg =
    ` *HPLabs Security Monitor*\n` +
    `*${isLab ? " New Lab" : " New Verified Vuln"}*: ${event.title}\n` +
    `*Severity:* ${event.severity}\n` +
    `*Tech:* ${event.affectedTechnology.slice(0, 3).join(", ")}\n` +
    `*CWE:* ${event.cwe?.join(", ") ?? "N/A"}\n` +
    `*HPLabs:* ${event.hplabsAvailability === "available" ? " Available" : " Coming Soon"}\n` +
    `${event.shortExplanation.slice(0, 150)}`;

  const results = await Promise.all([
    sendEmail(SUPPORT_EMAIL, subject, emailBody),
    sendWhatsApp(whatsAppMsg),
  ]);
  return { email: results[0], whatsapp: results[1] };
}
