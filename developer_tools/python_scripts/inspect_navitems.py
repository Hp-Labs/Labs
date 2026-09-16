path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.search(r'const navItems = \[[\s\S]*?\];', content)
if matches:
    print(matches.group(0))
