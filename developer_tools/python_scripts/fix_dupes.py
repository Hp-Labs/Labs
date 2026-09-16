path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Remove my manual addition
content = content.replace("import { ArrowRight, Shield, Target } from 'lucide-react';\n", "")
# Update the existing lucide import
content = re.sub(
    r'import \{([^}]+)\} from "lucide-react";',
    lambda m: f'import {{{m.group(1)}, ArrowRight}} from "lucide-react";',
    content
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed duplicate imports")
