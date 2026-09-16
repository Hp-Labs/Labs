import os

with open('src/lib/services/otpStore.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'db.prepare(' in lines[i] and 'INSERT INTO otp_store' in lines[i+1]:
        lines[i] = '  db.prepare(\n'
    if 'lockout_until = NULL' in lines[i]:
        if ')' in lines[i+1]:
            lines[i+1] = '  ).run(id, emailOTPHash, phoneOTPHash, phone, now, now + OTP_TTL_MS);\n'

with open('src/lib/services/otpStore.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

