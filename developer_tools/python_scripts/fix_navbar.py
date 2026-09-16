path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the specific Hardware Toolkit button since we will make it a standard nav item, or keep it but also add to mobile menu?
# The user said "public hub pakkana pettu navbar lo and 3 lines or dots meeda click chestey akkada ala manchiga pettu"
# So they want it next to Public Hub in the Navbar (as a regular link) and inside the mobile menu.
# It's better to just add it to navItems.

content = content.replace(
    '{ href: "/public", label: "Public Hub", icon: Globe, isLocked: false },',
    '{ href: "/public", label: "Public Hub", icon: Globe, isLocked: false },\n  { href: "/hardware", label: "Hardware Shop", icon: Zap, isLocked: false },'
)

# And remove the hardcoded specific button
start_tag = '<Link href="/hardware"'
if start_tag in content:
    # We will remove from <Link href="/hardware" to </Link>
    start_idx = content.find(start_tag)
    end_idx = content.find('</Link>', start_idx) + len('</Link>')
    # There might be some whitespace before start_idx
    content = content[:start_idx] + content[end_idx:]

# Wait, `Zap` is already imported, so it's fine. 
# But wait, `Zap` was imported from `lucide-react`. Let's check imports. Yes, it's there.
# Let's change `Hardware Shop` to `Hardware Toolkit` to be consistent.
content = content.replace('label: "Hardware Shop"', 'label: "Hardware Toolkit"')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Navbar to include Hardware Toolkit in navItems and mobile menu.")
