path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()

lines = content.split("\n")

# Find the lucide-react import
for i, line in enumerate(lines):
    if "from \"lucide-react\"" in line or "from 'lucide-react'" in line:
        if "ArrowRight" not in line:
            lines[i] = line.replace("}", ", ArrowRight }")
        break
else:
    # If no import found, add it
    lines.insert(1, "import { ArrowRight, Shield, Target } from 'lucide-react';")

with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
