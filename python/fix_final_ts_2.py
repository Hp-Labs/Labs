import os
import re

with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'd\.data\.map\(n =>', 'd.data.map((n: any) =>', c)
with open('src/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

