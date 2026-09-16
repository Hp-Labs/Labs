path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the exact block from `<input` to closing `</div>\n              )}`
start = content.find('              ) : (\n                <div className="space-y-2">\n                  <input')
if start == -1:
    print("Start not found")
    exit(1)

end = content.find("              )}", start) + len("              )}")
old_block = content[start:end]
print("OLD BLOCK:")
print(old_block.encode("ascii","replace").decode())
