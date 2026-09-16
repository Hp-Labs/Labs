import os

path = "src/lib/auth.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Fix "use client" position
c = c.replace('import { getRank } from "@/lib/data/types";\n', '')
c = c.replace('﻿"use client";', '"use client";\nimport { getRank } from "@/lib/data/types";')
c = c.replace('"use client";\n\nimport { getRank } from "@/lib/data/types";', '"use client";\nimport { getRank } from "@/lib/data/types";')

# make sure there's no duplicate
if c.count('"use client"') == 0:
    c = '"use client";\nimport { getRank } from "@/lib/data/types";\n' + c

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed auth.tsx")
