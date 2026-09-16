path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

for i in range(310, 350):
    if "icon:" in lines[i]:
        # print the exact line but escape it
        print(f"{i}: {repr(lines[i])}")
