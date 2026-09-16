path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if "SecurePoCUploader" in line:
        start = max(0, i - 3)
        end = min(len(lines), i + 3)
        print("\n".join(lines[start:end]))
