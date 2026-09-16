import os

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('style={{ width: % }}', 'style={{ width: ${xpProgress}% }}')
c = c.replace('style={{ width:  + "%" }}', 'style={{ width: ${xpProgress}% }}')

import re
c = re.sub(r'style=\{\{\s*width:\s*\$\{xpProgress\}%\s*\}\}', 'style={{ width: ${xpProgress}% }}', c)

with open('src/app/profile/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Replaced!")
