path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.finditer("Γ", content)
for m in matches:
    print(content[m.start()-20:m.start()+20].encode("ascii", "replace").decode())
