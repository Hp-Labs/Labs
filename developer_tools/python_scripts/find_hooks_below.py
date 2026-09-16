path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if "if (!unlocked) {" in line:
        start_locked = i
        break

hooks_found = []
for i in range(start_locked, len(lines)):
    if "useEffect" in lines[i] or "useCallback" in lines[i] or "useState" in lines[i]:
        hooks_found.append(f"{i}: {lines[i]}")

print("\n".join(hooks_found))
