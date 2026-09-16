import os

with open('src/lib/services/partnerOtpStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const token = \\PST-\\-\\l;', 'const token = PST--;')
c = c.replace('const token = \\PST-\\-\\;', 'const token = PST--;')

with open('src/lib/services/partnerOtpStore.ts', 'w', encoding='utf-8') as f:
    f.write(c)
