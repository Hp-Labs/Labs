path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

if "Settings" not in content[:500]:
    content = content.replace('Target,', 'Target, Settings,')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added Settings import.")
