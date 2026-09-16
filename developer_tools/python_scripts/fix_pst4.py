import os

with open('src/lib/services/partnerOtpStore.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

lines[137] = '  const token = PST--;\n'

with open('src/lib/services/partnerOtpStore.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)
