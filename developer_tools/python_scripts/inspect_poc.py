path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
poc = re.search(r'<SecurePoCUploader[\s\S]*?/>', content)
if poc:
    print(poc.group(0))
