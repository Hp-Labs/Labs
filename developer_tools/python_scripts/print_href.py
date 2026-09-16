path = "src/app/red-team/pentesting/[domain]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines):
    if "href=" in line or "Link" in line:
        print(line.strip())
