path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
for i, line in enumerate(lines[:20]):
    print(f"{i}: {line}")

# Just add `import { ArrowRight } from 'lucide-react';` as a separate line at line 10
lines.insert(10, "import { ArrowRight } from 'lucide-react';")

with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
