import os

with open('src/lib/services/partnerOtpStore.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'const token = PST' in line:
        lines[i] = '  const token = PST--;\n'

with open('src/lib/services/partnerOtpStore.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)
