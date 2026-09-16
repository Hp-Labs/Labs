path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for i in range(165, min(400, len(lines))):
    if lines[i].strip().startswith("return"):
        print(f"{i}: {lines[i]}")
