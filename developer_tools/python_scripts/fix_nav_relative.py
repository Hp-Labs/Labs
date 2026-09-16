path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '<div className="flex items-center justify-between h-16">',
    '<div className="flex items-center justify-between h-16 relative">'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added relative to h-16 container")
