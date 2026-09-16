path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find('<div className="flex items-center justify-between h-16">')
end_idx = content.find('</nav>')
print(content[start_idx:end_idx])
