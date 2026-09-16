path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
dom_idx = content.find("category.name")
if dom_idx != -1:
    start = max(0, dom_idx - 300)
    end = min(len(content), dom_idx + 300)
    print(content[start:end])
