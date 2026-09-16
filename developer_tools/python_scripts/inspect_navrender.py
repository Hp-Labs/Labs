path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.search(r'\{\/\* Nav Links.*\n\s*\{([^\}]+)', content)
if matches:
    print(matches.group(0))

matches2 = re.search(r'navItems\.filter\([^\)]*\)\.map', content)
if matches2:
    print(matches2.group(0))
else:
    print("No filter on navItems")
