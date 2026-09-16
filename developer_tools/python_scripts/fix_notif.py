import os

path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Fix notifySecurityEvent
c = c.replace(
    'sendEmail(isSecurityReport ? SECURITY_EMAIL : SUPPORT_EMAIL, subject, emailBody)',
    'sendEmail(SUPPORT_EMAIL, subject, emailBody)'
)
c = c.replace(
    'export async function notifySecurityEvent(event: SecurityEventNotification): Promise<void> {',
    'export async function notifySecurityEvent(event: SecurityEventNotification): Promise<boolean> {'
)

# Fix sendEmail ending return
import re
c = re.sub(
    r'(console\.error\("\[NotificationService\] Email error:", e\?\.message\);)(\s*\})',
    r'\1 return false;\2',
    c
)
c = re.sub(
    r'(console\.log\(`\[NotificationService\] Email sent to \$\{to\}`\);)(\s*\})',
    r'\1 return true;\2',
    c
)

# Fix sendWhatsApp ending return
c = re.sub(
    r'(console\.error\("\[NotificationService\] WhatsApp fetch error:", e\?\.message\);)(\s*\})',
    r'\1 return false;\2',
    c
)
c = re.sub(
    r'(console\.log\("\[NotificationService\] WhatsApp notification sent"\);)(\s*\})',
    r'\1 return true;\2',
    c
)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed notificationService.ts")
