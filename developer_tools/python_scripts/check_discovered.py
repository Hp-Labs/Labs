path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "rb") as f:
    content = f.read()

import re
matches = re.finditer(b"First Discovered:", content)
for m in matches:
    print(content[m.start():m.start()+100])
