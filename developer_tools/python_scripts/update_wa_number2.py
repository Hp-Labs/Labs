import os
path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('"+918309729774"', '"+91 83097 29774"')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated WhatsApp number spacing")
