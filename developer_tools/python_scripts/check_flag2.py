path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'Submit Flag[\s\S]{0,2000}?Submit\s*</button>', content)
if match:
    print(match.group(0)[:2000].encode("ascii","replace").decode())
else:
    print("Submit Flag section not found")
