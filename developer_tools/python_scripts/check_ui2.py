path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'(<div className="relative w-full h-full min-h-\[500px\]">[\s\S]*?)<div className={`grid', content)
if match:
    block = match.group(1)
    if "Target Compromised!" in block:
        print("Solved overlay is present.")
    if "Engagement Failed" in block:
        print("Failed overlay is present.")
else:
    print("Not found")
