import os
import re

# dashboard/page.tsx
with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'import\s+{\s*useEffect\s*}\s*from\s*"react"\s*;\s*', '', c, count=1)
c = c.replace('.map((n) =>', '.map((n: any) =>')
with open('src/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# webhook/route.ts
with open('src/app/api/premium/webhook/route.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('const targetUser = getUserById(', 'const targetUser: any = getUserById(')
with open('src/app/api/premium/webhook/route.ts', 'w', encoding='utf-8') as f:
    f.write(c)

# smartEngine.ts
with open('src/lib/services/smartEngine.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'check:\s*payload\.check,?', '', c)
with open('src/lib/services/smartEngine.ts', 'w', encoding='utf-8') as f:
    f.write(c)

