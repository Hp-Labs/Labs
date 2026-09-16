path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

start_idx = -1
for i, line in enumerate(lines):
    if "{/*  LEFT: Lab Content  */}" in line:
        start_idx = i
        break

if start_idx != -1:
    print(f"Starts at {start_idx}")
    end_idx = -1
    for i in range(len(lines) - 1, start_idx, -1):
        if "</div>" in lines[i]:
            print(f"End div at {i}")
            print("\n".join(lines[start_idx:i-3]))
            break
