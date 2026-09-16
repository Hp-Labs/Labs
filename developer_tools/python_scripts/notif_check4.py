import os

path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('console.error("[NotificationService] Email relay error:", err);', 'console.error("[NotificationService] Email relay error:", err);\n      return false;')
c = c.replace('console.error("[NotificationService] WhatsApp error:", err);', 'console.error("[NotificationService] WhatsApp error:", err);\n      return false;')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed return")
