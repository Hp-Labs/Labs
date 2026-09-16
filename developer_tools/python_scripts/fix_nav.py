import os
import re

path = 'src/components/Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the whole block manually
c = re.sub(r'\{\/\* Daily Bonus Claim Button \*\/\}.*?<\/button>\n\s*\}\)\s*', '', c, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Button removed!")
