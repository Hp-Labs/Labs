path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove the Coffee button block
coffee_block = r'''                  <a
                    href="https://buymeacoffee.com/manivarma3p"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-amber-500/80 hover:text-amber-400 hover:bg-amber-500/10 transition-all drop-shadow-\[0_0_8px_rgba\(245,158,11,0\.5\)\]"
                    title="Buy Me a Coffee \u2615"
                  >
                    <Coffee size=\{15\} />
                  </a>\n'''

content = re.sub(coffee_block, '', content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed Coffee icon from Navbar")
