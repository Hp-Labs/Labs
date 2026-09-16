path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re
match = re.search(r'const isSeverityUnlocked =[\s\S]*?\n  \};', content)
if match:
    print(match.group(0))
else:
    print("isSeverityUnlocked not found")

match2 = re.search(r'const isLevelUnlocked =[\s\S]*?\n  \};', content)
if match2:
    print(match2.group(0))
