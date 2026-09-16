path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re
dom_idx = content.find("Blue Team")
if dom_idx != -1:
    start = max(0, dom_idx - 200)
    end = min(len(content), dom_idx + 1000)
    print(content[start:end].encode("ascii", "ignore").decode())
