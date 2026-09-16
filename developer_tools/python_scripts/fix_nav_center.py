path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix left container
content = content.replace(
    'className="flex items-center gap-3 group shrink-0 lg:w-1/4"',
    'className="flex items-center gap-3 group shrink-0 z-10"'
)

# Fix center container - make it perfectly centered using absolute on lg screens
content = content.replace(
    '<div className="hidden lg:flex items-center justify-center flex-1 gap-1.5 mx-4">',
    '<div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-1 w-max z-0">'
)

# Fix right container
content = content.replace(
    '<div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 lg:w-1/4">',
    '<div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 z-10">'
)

# Reduce padding on nav items so they fit better
content = content.replace(
    'className={`flex items-center gap-1.5 px-3 py-1.5',
    'className={`flex items-center gap-1.5 px-2.5 py-1.5'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Navbar layout for perfect centering")
