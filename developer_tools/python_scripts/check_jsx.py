path = "src/app/labs/[id]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if "setFlagInput(" in line or "flagInput" in line and "value" in line:
        start = max(0, i - 15)
        end = min(len(lines), i + 25)
        print("\n".join(lines[start:end]).encode("ascii", "ignore").decode())
        break
