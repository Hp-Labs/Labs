import os
import re

with open('src/lib/services/partnerOtpStore.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'const token = PST--;', 'const token = PST--;', c)

with open('src/lib/services/partnerOtpStore.ts', 'w', encoding='utf-8') as f:
    f.write(c)
