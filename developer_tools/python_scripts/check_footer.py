path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
footer_match = re.search(r'<footer[^>]*>[\s\S]*?</footer>', content)
if footer_match:
    print(footer_match.group(0).encode("ascii","replace").decode())
else:
    print("Footer not found")
