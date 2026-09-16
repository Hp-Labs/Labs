path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.findall(r'useEffect\(\(\) => \{[\s\S]*?\}, \[.*?\]\);', content)
print("UseEffects found:", len(matches))
for i, m in enumerate(matches):
    print(f"Effect {i}: {m[:200]}")
