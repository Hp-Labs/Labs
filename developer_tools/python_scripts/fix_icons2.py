path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Find all imports from lucide-react
all_icons = set()
def replacer(m):
    icons = m.group(1).split(",")
    for icon in icons:
        icon = icon.strip()
        if icon:
            all_icons.add(icon)
    return ""

content = re.sub(r'import\s+\{([^}]+)\}\s+from\s+["\']lucide-react["\'];', replacer, content)

# Now inject the clean import at the top
unique_icons = sorted(list(all_icons))
import_str = f"import {{ {', '.join(unique_icons)} }} from 'lucide-react';\n"
content = content.replace("'use client';", "'use client';\n" + import_str)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Consolidated imports:", import_str)
