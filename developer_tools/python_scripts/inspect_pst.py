import os

with open('src/lib/services/partnerOtpStore.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(repr(lines[137]))

