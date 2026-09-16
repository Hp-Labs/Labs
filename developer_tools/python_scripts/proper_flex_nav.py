path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Revert relative on h-16 container
content = content.replace(
    '<div className="flex items-center justify-between h-16 relative">',
    '<div className="flex items-center justify-between h-16 w-full gap-4">'
)

# Left container: Logo
# Currently: className="flex items-center gap-3 group shrink-0 z-10"
import re
content = re.sub(
    r'<Link href=\{user \? "/dashboard" : "/"} className="flex items-center gap-3 group[^"]*">',
    '<Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group flex-1 justify-start">',
    content
)

# Center container: Nav Links
# Currently: className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-1 w-max z-0"
content = re.sub(
    r'<div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-[^"]*">',
    '<div className="hidden lg:flex items-center justify-center gap-1 shrink-0">',
    content
)

# Right container: Profile / Toggles
# Currently: className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 z-10"
content = re.sub(
    r'<div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 z-10">',
    '<div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">',
    content
)

# Put padding back to px-3 to look normal
content = content.replace(
    'className={`flex items-center gap-1.5 px-2.5 py-1.5',
    'className={`flex items-center gap-1.5 px-3 py-1.5'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Applied proper flex-1 centering fix")
