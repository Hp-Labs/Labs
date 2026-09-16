import os
import re

with open('src/lib/services/otpStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'db\.prepare\(\s*INSERT', 'db.prepare(\n    INSERT', c)

with open('src/lib/services/otpStore.ts', 'w', encoding='utf-8') as f:
    f.write(c)

