path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'LEFT: Lab Content', content)
if match:
    print(f"Found at {match.start()}")
    print(repr(content[match.start()-20:match.start()+40]))
else:
    print("Not found")
