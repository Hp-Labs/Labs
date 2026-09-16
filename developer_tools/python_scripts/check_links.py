path = "src/app/red-team/pentesting/[domain]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
links = re.findall(r'href=\{`\/red-team\/pentesting\/\$\{domainId\}\/\$\{sev\.id\}\/([^`]+)`\}', content)
print("Links format:", set(links))
