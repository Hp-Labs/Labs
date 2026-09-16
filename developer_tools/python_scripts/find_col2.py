import os
import re

with open('src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

match = re.search(r'\{\/\* Column 2: Plan & Status \*\/\}.*?\{\/\* Column 3: Stats \*\/\}', c, flags=re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Column 2 not found!")
