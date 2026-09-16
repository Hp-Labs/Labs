import os
import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's find some snippets with â
lines = c.split('\n')
for i, line in enumerate(lines):
    if 'â' in line:
        print(f"Original: {repr(line.strip())}")
        try:
            fixed = line.encode('cp1252').decode('utf-8')
            print(f"Fixed: {repr(fixed.strip())}")
        except Exception as e:
            # print("error", e)
            pass

