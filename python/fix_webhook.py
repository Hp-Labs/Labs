import os
import re

with open('src/app/api/premium/webhook/route.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('user.id', '((user as any).id || user_id)')
with open('src/app/api/premium/webhook/route.ts', 'w', encoding='utf-8') as f:
    f.write(c)
