path = "src/app/red-team/pentesting/[domain]/[severity]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for line in lines:
    if "href=" in line:
        print(line.strip())
