path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find the exact handleSubmitFlag definition
matches = list(re.finditer(r"handleSubmitFlag", content))
for m in matches:
    snippet = content[m.start()-5:m.start()+80].encode("ascii","replace").decode()
    print(f"At {m.start()}: {snippet}")
    print("---")
