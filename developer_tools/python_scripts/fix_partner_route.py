import os
import re

with open('src/app/api/partner/request-otp/route.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'message:\s*Please wait  seconds before requesting another code\.', 'message: Please wait  seconds before requesting another code.', c)

with open('src/app/api/partner/request-otp/route.ts', 'w', encoding='utf-8') as f:
    f.write(c)

