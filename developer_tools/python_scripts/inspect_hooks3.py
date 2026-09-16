path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines[160:260]):
    print(160 + i + 1, line.rstrip())
