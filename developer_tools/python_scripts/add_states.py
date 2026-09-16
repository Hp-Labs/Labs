path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add state variables
state_vars = """  const [failed, setFailed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeoutPenalty, setTimeoutPenalty] = useState<number | null>(null);"""
content = content.replace("const [active, setActive] = useState(false);", "const [active, setActive] = useState(false);\n" + state_vars)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added state variables")
