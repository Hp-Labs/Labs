path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.finditer(r'[^\x00-\x7F\u2022\u274c]', content)
unusual = set()
for m in matches:
    unusual.add(m.group(0))

print("Unusual chars:", [u for u in unusual])
