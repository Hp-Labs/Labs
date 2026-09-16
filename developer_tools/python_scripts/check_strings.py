path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

print("LEFT:", content.find('{/*  LEFT: Lab Content  */}'))
print("LEFT:", content.find('LEFT: Lab Content'))
print("Left:", content.find('LEFT:'))
