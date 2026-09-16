path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
m = re.search(r'import \{[^}]+\} from "lucide-react";', content)
if m:
    print("Found:", m.group(0))
else:
    print("Not found")

# Let's just blindly add it at the top if it's not there.
if "import { ArrowRight" not in content:
    content = content.replace('import { Shield', 'import { Shield, ArrowRight')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Forced ArrowRight")
