path = "src/lib/services/labSessionStore.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

import re
create_match = re.search(r'export function createLabSession\([^)]*\)', content)
if create_match:
    print(content[create_match.start():create_match.start()+300])
else:
    print("createLabSession not found")
