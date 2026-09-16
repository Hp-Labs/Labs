path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines):
    if "const handleActivate = useCallback" in line:
        print("handleActivate at", i)
        for j in range(i-50, i):
            print(f"{j}: {lines[j].encode('ascii', 'ignore').decode().strip()}")
        break
