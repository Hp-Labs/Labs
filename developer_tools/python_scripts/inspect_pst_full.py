import os

with open('src/lib/services/partnerOtpStore.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(130, 150):
    print(f"{i+1}: {repr(lines[i])}")

