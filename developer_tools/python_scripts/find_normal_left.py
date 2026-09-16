path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
normal_left = re.search(r'(\{\/\*  LEFT: Lab Content  \*\/\}[\s\S]*?)</div>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*\);\n\}', content)
if normal_left:
    print("Found normal left column. Length:", len(normal_left.group(1)))
    print("Ends with:", normal_left.group(1)[-200:])
else:
    print("Not found")
