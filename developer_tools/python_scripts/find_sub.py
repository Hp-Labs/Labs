path = "src/app/dashboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.finditer(r'Subscription', content, re.IGNORECASE)
for m in matches:
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 100)
    print(f"Match around {m.start()}:\n{content[start:end]}\n{'-'*40}")
