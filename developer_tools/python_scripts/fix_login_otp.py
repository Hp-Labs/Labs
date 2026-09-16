import os

with open('src/app/login/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('maxLength={6}', 'maxLength={8}')
c = c.replace("replace(/\\D/g, '')", "replace(/[^a-zA-Z0-9]/g, '')")
c = c.replace('otpCode.length < 6', 'otpCode.length < 8')
c = c.replace('6-Digit', '8-Char')
c = c.replace('6-digit', '8-char')

with open('src/app/login/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/lib/auth.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('100000 + Math.random() * 900000', 'Math.random().toString(36).substring(2, 10).toUpperCase()')

with open('src/lib/auth.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

