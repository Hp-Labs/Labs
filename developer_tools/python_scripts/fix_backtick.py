import os

with open('src/lib/services/otpStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('db.prepare(\\', 'db.prepare(')
c = c.replace('lockout_until = NULL\n  \\).run', 'lockout_until = NULL\n  ).run')

with open('src/lib/services/otpStore.ts', 'w', encoding='utf-8') as f:
    f.write(c)
