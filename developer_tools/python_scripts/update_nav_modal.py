import os

path = 'src/components/Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

if 'DailyBonusModal' not in c:
    c = c.replace('import { ThemeToggle } from "./ThemeToggle";', 'import { ThemeToggle } from "./ThemeToggle";\nimport { DailyBonusModal } from "./DailyBonusModal";')
    c = c.replace('return (\n    <nav', 'return (\n    <>\n      <DailyBonusModal />\n      <nav')
    c = c.replace('</nav>\n  );', '</nav>\n    </>\n  );')
    
    # Remove the old daily bonus button from the Navbar
    import re
    c = re.sub(r'\{\/\* Daily Bonus Claim Button \*\/\}.*?<\/button>\n\s*\}\)', '', c, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Navbar updated with DailyBonusModal")
