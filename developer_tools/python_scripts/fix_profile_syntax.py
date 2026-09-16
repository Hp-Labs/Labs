import os
import re

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'style=\{\{\s*width:\s*\$\{xpProgress\}%\s*\}\}', 'style={{ width: ${xpProgress}% }}', c)

with open('src/app/profile/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
