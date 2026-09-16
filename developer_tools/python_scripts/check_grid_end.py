path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

in_left = False
left_indent = 0
for i, line in enumerate(lines):
    if "lg:col-span-2" in line:
        print("Found left column at line", i)
        in_left = True
        left_indent = len(line) - len(line.lstrip())
    elif in_left:
        # if the indentation matches the start of lg:col-span-2 and it's a closing div
        indent = len(line) - len(line.lstrip())
        if indent == left_indent and "</div>" in line:
            print("Left column ends at line", i)
            # print the next 50 lines
            print("\n".join(lines[i+1:i+50]))
            break
