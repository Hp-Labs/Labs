import os
path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('const WHATSAPP_TO_NUMBER = process.env.WHATSAPP_TO_NUMBER ?? "";', 'const WHATSAPP_TO_NUMBER = process.env.WHATSAPP_TO_NUMBER ?? "+918309729774";')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated WhatsApp number")
