path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import Coffee
content = content.replace(
    'Menu, X, Globe } from "lucide-react";',
    'Menu, X, Globe, Coffee } from "lucide-react";'
)

# 2. Define the coffee button snippet
coffee_button = """                  <a
                    href="https://buymeacoffee.com/manivarma3p"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-amber-500/80 hover:text-amber-400 hover:bg-amber-500/10 transition-all drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    title="Buy Me a Coffee \u2615"
                  >
                    <Coffee size={15} />
                  </a>
"""

# 3. Add to logged-in users (before ExternalLink)
content = content.replace(
    '''                <div className="flex items-center gap-1">
                  <a
                    href="https://hackerplus.in"''',
    '''                <div className="flex items-center gap-1">
''' + coffee_button + '''                  <a
                    href="https://hackerplus.in"'''
)

# 4. Add to logged-out users (if similar section exists)
content = content.replace(
    '''              <>
                <a
                  href="https://hackerplus.in"''',
    '''              <>
''' + coffee_button + '''                <a
                  href="https://hackerplus.in"'''
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added Buy Me a Coffee link to Navbar!")
