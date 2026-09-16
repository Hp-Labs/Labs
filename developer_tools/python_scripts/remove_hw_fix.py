import re

path = "src/app/public/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'\s*\{\/\* TAB: HARDWARE TOOLKIT \*\/\}\s*\{activeTab === \'hardware\' && \([\s\S]*?\}\)'
content = re.sub(pattern, "", content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed remaining activeTab === 'hardware' block.")
