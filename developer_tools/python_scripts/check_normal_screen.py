path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines[430:465]):
    print(f"{i+430}: {line.encode('ascii', 'ignore').decode().strip()}")
