path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines):
    if "placeholder=\"FLAG" in line:
        start = max(0, i - 1)
        end = min(len(lines), i + 15)
        print("\n".join(lines[start:end]).encode("ascii", "ignore").decode())
        break
