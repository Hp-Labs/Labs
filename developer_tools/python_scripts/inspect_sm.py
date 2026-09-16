path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re
sm_idx = content.find("Security Monitor")
if sm_idx != -1:
    start = max(0, sm_idx - 150)
    end = min(len(content), sm_idx + 300)
    print(content[start:end].encode("ascii", "ignore").decode())
