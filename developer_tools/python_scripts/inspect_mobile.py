path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.finditer(r'mobileMenuOpen', content)
for m in matches:
    print("Match at", m.start())

# Let's see the bottom of Navbar.tsx
print("\n--- Bottom of Navbar ---")
lines = content.split("\n")
print("\n".join(lines[-40:]))
