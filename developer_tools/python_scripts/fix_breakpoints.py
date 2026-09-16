path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make the mobile menu toggle show on lg as well, and hide on xl
content = content.replace(
    'className="lg:hidden flex items-center justify-center p-2 rounded-md',
    'className="xl:hidden flex items-center justify-center p-2 rounded-md'
)

# Make the center nav items only show on xl instead of lg
content = content.replace(
    '<div className="hidden lg:flex items-center justify-center gap-1 shrink-0">',
    '<div className="hidden xl:flex items-center justify-center gap-1 shrink-0 flex-1">'
)

# And similarly for the mobile dropdown
content = content.replace(
    '<div className="lg:hidden absolute top-16 left-0 right-0',
    '<div className="xl:hidden absolute top-16 left-0 right-0'
)

# For the flex-1 left/right, let's just make them standard so they don't force center alignment if there's no room
# Left:
import re
content = re.sub(
    r'className="flex items-center gap-3 group flex-1 justify-start">',
    'className="flex items-center gap-2 sm:gap-3 group flex-none shrink-0">',
    content
)

# Right:
content = re.sub(
    r'<div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">',
    '<div className="flex items-center justify-end gap-2 sm:gap-3 flex-none shrink-0">',
    content
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Navbar breakpoints from lg to xl and fixed flex containers")
