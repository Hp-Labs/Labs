path = "src/app/api/labs/[id]/activity/route.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re
post_match = re.search(r'if \(action === "start"\) \{[\s\S]*?\}', content)
if post_match:
    print(post_match.group(0))
else:
    print("start action not found")
