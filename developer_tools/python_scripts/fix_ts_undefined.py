path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Carefully replace lab. with lab?. globally, except where it says `const lab` (which doesn't have a dot anyway).
content = re.sub(r'\blab\.(?!\?)', 'lab?.', content)
# Also fix lab?.?.id just in case
content = content.replace("lab?.?.id", "lab?.id")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced lab. with lab?.")
