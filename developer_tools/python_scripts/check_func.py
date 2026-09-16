path = "src/app/labs/[id]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if "const handleFlagSubmit" in line:
        start = max(0, i - 2)
        end = min(len(lines), i + 40)
        print("\n".join(lines[start:end]).encode("ascii", "ignore").decode())
        break
