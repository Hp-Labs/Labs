import re
with open("src/lib/data/redteam/index.ts", "r", encoding="utf-8") as f:
    c = f.read()
    exports = re.findall(r'export (function|const) (\w+)', c)
    print("Exports:")
    for ext, name in exports:
        print(name)
