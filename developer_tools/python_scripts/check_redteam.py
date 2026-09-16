path = "src/lib/data/redteam.ts"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines[:30]):
    print(f"{i}: {line}")
