path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

in_normal = False
for line in lines:
    if "return (" in line and "<div className=\"min-h-screen" in line:
        in_normal = not in_normal  # Second time it flips to False? No, just flag it.
        if in_normal: pass # first return
        else:
            print("Second return found!")
            in_normal = True # just to capture the second one
            
    if in_normal and "grid grid-cols-1" in line:
        break
    if in_normal:
        print(line.encode('ascii', 'ignore').decode().strip())
