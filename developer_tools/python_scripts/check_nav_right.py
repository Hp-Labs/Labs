path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'\{/\* Streak Counter \*/\}', content)
if match:
    idx = match.start()
    print(content[idx-200:idx+200])
