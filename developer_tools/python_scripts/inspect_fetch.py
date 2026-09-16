path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
fetch_calls = re.findall(r'fetch\([^)]+\)', content)
print("Fetch calls in page.tsx:\n", "\n".join(fetch_calls))
