path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
success_overlay = re.search(r'\{showSuccess && \([\s\S]*?Target Compromised![\s\S]*?\)\}', content)
if success_overlay:
    print(success_overlay.group(0)[:500])
else:
    print("Success overlay not found")
