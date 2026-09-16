path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
right_panel = re.search(r'(<!-- Right Panel -->[\s\S]*?)</div>\n\s*</div>\n\s*</div>\n\s*</div>', content)
if right_panel:
    print(right_panel.group(1)[:1500])
else:
    print("Right panel not found")
