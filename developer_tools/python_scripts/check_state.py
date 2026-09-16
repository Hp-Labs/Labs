path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines[:120]):
    if "solved" in line.lower() or "active" in line.lower() or "islevelcompleted" in line.lower():
        print(f"{i}: {line}")
