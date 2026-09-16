path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i in range(80, 125):
    print(f"{i}: {lines[i].encode('ascii', 'ignore').decode()}")
