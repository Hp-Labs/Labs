path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if "Activate Lab" in line:
        start = max(0, i - 10)
        end = min(len(lines), i + 35)
        print("\n".join(lines[start:end]).encode("ascii", "ignore").decode())
        break
