path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines[39:150]):
    print(f"{i+40}: {line.strip().encode('ascii', 'ignore').decode()}")
