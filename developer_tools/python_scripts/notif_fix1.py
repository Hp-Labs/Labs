import os

path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# 1. Fix sendEmail and sendWhatsApp return true/false properly
c = c.replace('console.log(`[NotificationService] Email sent to ${to}`); return true;', 'console.log(`[NotificationService] Email sent to ${to}`);')
c = c.replace('console.log("[NotificationService] WhatsApp notification sent"); return true;', 'console.log("[NotificationService] WhatsApp notification sent");')

c = c.replace('console.log(`[NotificationService] Email sent to ${to}`);', 'console.log(`[NotificationService] Email sent to ${to}`);\n      return true;')
c = c.replace('console.log("[NotificationService] WhatsApp notification sent");', 'console.log("[NotificationService] WhatsApp notification sent");\n      return true;')

c = c.replace('console.error("[NotificationService] Email relay error:", err);', 'console.error("[NotificationService] Email relay error:", err);\n      return false;')
c = c.replace('console.error("[NotificationService] WhatsApp error:", err);', 'console.error("[NotificationService] WhatsApp error:", err);\n      return false;')

if "return true;" not in c:
    pass

# Check the end of notifySecurityEvent
c = c.replace('export async function notifySecurityEvent(event: SecurityEventNotification): Promise<void> {', 'export async function notifySecurityEvent(event: SecurityEventNotification, isSecurityReport = false): Promise<void> {')
# wait, the error is at 248. Let me just open and see what is at line 248.
