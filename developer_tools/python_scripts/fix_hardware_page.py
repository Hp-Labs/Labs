path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("Tool,", "")
content = content.replace("Tool ,", "")
content = content.replace(" Tool ", " PenTool ") # Maybe they used Tool icon somewhere? Let's check.

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed Tool import")
