path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'(<div className="lg:col-span-1 space-y-6">[\s\S]*?)</div>\n\s*</div>\n\s*</div>\n\s*</div>', content)
if match:
    print(match.group(1)[:1500])
else:
    print("lg:col-span-1 not found")
