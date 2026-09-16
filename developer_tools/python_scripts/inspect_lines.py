path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "Blue Team" in line or "Threat Intelligence" in line or "What's Inside" in line:
        print(f"{i}: {line.encode('ascii', 'ignore').decode().strip()}")
