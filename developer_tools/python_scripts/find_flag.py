path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the exact flag input block
idx = content.find("FLAG{...}")
if idx == -1:
    print("FLAG{...} not found")
else:
    print(content[idx-200:idx+400].encode("ascii","replace").decode())
