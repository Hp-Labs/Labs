path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'(return \([\s\S]*?<div className="relative w-full h-full min-h-\[500px\]">)', content)
if match:
    print(match.group(1))
else:
    print("Not found")
