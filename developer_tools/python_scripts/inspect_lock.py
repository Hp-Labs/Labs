path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re
matches = re.finditer(r'unlocked\s*=', content)
for m in matches:
    print(content[m.start()-50:m.start()+150].replace("\n", " "))
