import os
import re

with open('src/lib/services/otpStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'db\.prepare\(\n\s*INSERT INTO otp_store \(identifier, email_otp, phone_otp, phone, created_at, expires_at, attempts, lockout_until\)\n\s*VALUES \(\?, \?, \?, \?, \?, \?, 0, NULL\)\n\s*ON CONFLICT\(identifier\) DO UPDATE SET\n\s*email_otp = excluded\.email_otp,\n\s*phone_otp = excluded\.phone_otp,\n\s*phone = excluded\.phone,\n\s*expires_at = excluded\.expires_at,\n\s*attempts = 0,\n\s*lockout_until = NULL\n\s*\)\.run\(', 'db.prepare("INSERT INTO otp_store (identifier, email_otp, phone_otp, phone, created_at, expires_at, attempts, lockout_until) VALUES (?, ?, ?, ?, ?, ?, 0, NULL) ON CONFLICT(identifier) DO UPDATE SET email_otp = excluded.email_otp, phone_otp = excluded.phone_otp, phone = excluded.phone, expires_at = excluded.expires_at, attempts = 0, lockout_until = NULL").run(', c)

with open('src/lib/services/otpStore.ts', 'w', encoding='utf-8') as f:
    f.write(c)

