path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.findall(r'placeholder="FLAG', content)
print("Flag inputs found:", len(matches))
