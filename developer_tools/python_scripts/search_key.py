path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines):
    if "Level Locked" in line or "Return to Domain" in line or "Deploy Target" in line:
        print(f"Line {i}: {line.strip()}")
