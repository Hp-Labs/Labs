path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

if "lucide-react" not in content:
    content = content.replace(
        "'use client';",
        "'use client';\nimport { ArrowRight, Shield, Target } from 'lucide-react';"
    )
else:
    # It has lucide-react but my regex failed. Let's just add it manually.
    content = "'use client';\nimport { ArrowRight, Shield, Target } from 'lucide-react';\n" + content.replace("'use client';", "")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added imports explicitly")
