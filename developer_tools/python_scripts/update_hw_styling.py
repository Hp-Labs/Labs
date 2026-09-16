path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure cards fill height
content = content.replace(
    'className="group relative flex flex-col',
    'className="group relative flex flex-col h-full'
)

# Change object-cover to object-contain so we don't crop images
content = content.replace(
    'className="w-full h-full object-cover opacity-80',
    'className="w-full h-full object-contain p-4 opacity-80'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated hardware page styling")
