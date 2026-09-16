path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'\{!active && !failed && !showSuccess && \([\s\S]*?Activate Lab\n\s*</button>', content)
if match:
    print(match.group(0))
else:
    print("Activate lab button condition not found!")
