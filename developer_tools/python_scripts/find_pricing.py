path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.finditer(r'.{0,50}Pricing.{0,50}', content)
for m in matches:
    print(m.group(0))
