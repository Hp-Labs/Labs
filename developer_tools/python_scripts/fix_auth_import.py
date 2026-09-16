import os
import re

path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('import { getRank } from "@/lib/data/types";\nexport function getUserBadgesAndRank', 'export function getUserBadgesAndRank')
if 'import { getRank } from "@/lib/data/types";' not in c:
    c = 'import { getRank } from "@/lib/data/types";\n' + c

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Fixed import in auth.tsx")
