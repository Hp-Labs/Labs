import os
import re

# dashboard/page.tsx
with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'data\.notifications\.map\(\s*\(n\)\s*=>', 'data.notifications.map((n: any) =>', c)
with open('src/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# webhook/route.ts
with open('src/app/api/premium/webhook/route.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'const targetUser = getUserById', 'const targetUser: any = getUserById', c)
with open('src/app/api/premium/webhook/route.ts', 'w', encoding='utf-8') as f:
    f.write(c)

# smartEngine.ts
with open('src/lib/services/smartEngine.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'check:\s*payload\.check,?', '', c)
with open('src/lib/services/smartEngine.ts', 'w', encoding='utf-8') as f:
    f.write(c)
