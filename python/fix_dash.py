import os

with open('src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { useState, useEffect }' not in c and 'import React' not in c:
    c = c.replace('import { useAuth }', 'import { useState, useEffect } from "react";\nimport { useAuth }')

with open('src/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
