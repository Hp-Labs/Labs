import os

path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('async function sendEmail(to: string, subject: string, body: string): Promise<void> {', 'async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {')
c = c.replace('return;', 'return false;')
c = c.replace('return false; // added by script', 'return false;')
c = c.replace('console.log(`[NotificationService] Email sent to ${to}`);', 'console.log(`[NotificationService] Email sent to ${to}`); return true;')
c = c.replace('console.error("[NotificationService] Email error:", e?.message);', 'console.error("[NotificationService] Email error:", e?.message); return false;')

c = c.replace('async function sendWhatsApp(message: string): Promise<void> {', 'async function sendWhatsApp(message: string): Promise<boolean> {')
c = c.replace('return false; // added by script', 'return false;')
c = c.replace('console.log("[NotificationService] WhatsApp notification sent");', 'console.log("[NotificationService] WhatsApp notification sent"); return true;')
c = c.replace('console.error("[NotificationService] WhatsApp fetch error:", e?.message);', 'console.error("[NotificationService] WhatsApp fetch error:", e?.message); return false;')

c = c.replace('export async function notifySupportTeam(ticket: SupportTicket): Promise<void> {', 'export async function notifySupportTeam(ticket: SupportTicket, isSecurityReport = false): Promise<boolean> {')
c = c.replace('const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@hackerplus.in";', 'const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@hackerplus.in";\nconst SECURITY_EMAIL = process.env.SECURITY_EMAIL ?? "security@hackerplus.in";')
c = c.replace('SUPPORT_EMAIL,', 'isSecurityReport ? SECURITY_EMAIL : SUPPORT_EMAIL,')

# Fix promise.all mapping
c = c.replace('await Promise.all([\n    sendEmail(', 'const results = await Promise.all([\n    sendEmail(')
c = c.replace('sendWhatsApp(whatsAppMsg),\n  ]);', 'sendWhatsApp(whatsAppMsg),\n  ]);\n  return results.some(r => r === true);')

c = c.replace('export async function notifyUserTicketCreated(ticket: SupportTicket): Promise<void> {', 'export async function notifyUserTicketCreated(ticket: SupportTicket): Promise<boolean> {')
c = c.replace('await sendEmail(', 'return await sendEmail(')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated notificationService.ts")
