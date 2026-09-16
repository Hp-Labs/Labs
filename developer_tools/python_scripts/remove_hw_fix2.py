path = "src/app/public/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find("{/* TAB: HARDWARE TOOLKIT */}")
if start_idx != -1:
    end_idx = content.find(")}", start_idx) + 2
    content = content[:start_idx] + content[end_idx:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Found and removed.")
else:
    print("Not found.")
