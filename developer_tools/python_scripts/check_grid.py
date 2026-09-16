path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'<div className={`grid grid-cols-1 lg:grid-cols-3 gap-8[\s\S]*', content)
if match:
    print(match.group(0)[:2000])
else:
    print("Grid not found")
