path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines[550:650]):
    if "button" in line or "handleActivate" in line:
        print(f"{i+550}: {line.encode('ascii', 'ignore').decode().strip()}")
