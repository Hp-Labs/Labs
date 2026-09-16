path = "src/lib/db.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re
matches = list(re.finditer(r'CREATE TABLE IF NOT EXISTS users[\s\S]*?\);', content))
if matches:
    print(matches[0].group(0))
else:
    print("Could not find CREATE TABLE users")
