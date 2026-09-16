path = "src/app/dashboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")
for i, line in enumerate(lines[-20:]):
    print(f"{len(lines)-20+i}: {line}")
