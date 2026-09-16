import os
import re

path = "src/app/profile/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Delete ACTIVITY constant
c = re.sub(r'// Activity heatmap mock data.*?return \{ day: i, count: .*? \? Math\.floor\(.*? \+ 1 : 0 \};\n\}\);\n', '', c, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Removed mock ACTIVITY")
