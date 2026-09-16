path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('LEFT: Lab Content')
print(repr(content[idx-20:idx+40]))
