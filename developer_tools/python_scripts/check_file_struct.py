path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

in_locked = False
for i, line in enumerate(lines):
    if "if (!unlocked)" in line:
        print("--- if (!unlocked) FOUND at line", i)
        in_locked = True
    elif "return (" in line and not in_locked:
        print("--- Main return FOUND at line", i)
    elif "return (" in line and in_locked:
        print("--- locked return FOUND at line", i)
