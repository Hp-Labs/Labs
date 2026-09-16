with open("src/app/api/support/route.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if "userId" in l:
        print(f"{i+1}: {l.strip()}")
