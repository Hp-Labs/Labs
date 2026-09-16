import os

path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Update notifySupportTeam signature
c = c.replace(
    'export async function notifySupportTeam(ticket: SupportTicket, isSecurityReport = false): Promise<"sent" | "failed" | "not-configured"> {',
    'export async function notifySupportTeam(ticket: SupportTicket, isSecurityReport = false): Promise<{ email: "sent"|"failed"|"not-configured", whatsapp: "sent"|"failed"|"not-configured" }> {'
)

# Update notifySupportTeam return
c = c.replace(
    'return results.some(r => r === true);',
    'return { email: results[0], whatsapp: results[1] };'
)

# Update notifySecurityEvent signature & return
c = c.replace(
    'export async function notifySecurityEvent(event: SecurityEventNotification): Promise<"sent" | "failed" | "not-configured"> {',
    'export async function notifySecurityEvent(event: SecurityEventNotification): Promise<{ email: "sent"|"failed"|"not-configured", whatsapp: "sent"|"failed"|"not-configured" }> {'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated notificationService return types")
