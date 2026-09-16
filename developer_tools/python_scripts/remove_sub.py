path = "src/app/dashboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if '{ label: "Subscription"' not in line:
        new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Removed Subscription line from dashboard")
