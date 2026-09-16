path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
act = re.search(r'fetch\(`/api/labs/\$\{labId\}/activity.*?\n.*?\n.*?\n.*?', content, re.DOTALL)
if act:
    print(act.group(0))
