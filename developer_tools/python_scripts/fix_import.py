path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add ArrowRight to the lucide-react imports
import re
content = re.sub(
    r'import \{([^}]+)\} from "lucide-react";',
    lambda m: f'import {{{m.group(1)}, ArrowRight}} from "lucide-react";' if 'ArrowRight' not in m.group(1) else m.group(0),
    content
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Imported ArrowRight")
