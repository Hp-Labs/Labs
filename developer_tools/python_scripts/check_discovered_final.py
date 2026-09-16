path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("First Discovered:")
if idx != -1:
    snippet = content[idx:idx+100]
    print(snippet.encode("ascii", "replace").decode())
