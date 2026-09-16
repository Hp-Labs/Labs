import os

with open('src/lib/services/otpStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('db.prepare(\n    INSERT', 'db.prepare(\n    INSERT')

with open('src/lib/services/otpStore.ts', 'w', encoding='utf-8') as f:
    f.write(c)

