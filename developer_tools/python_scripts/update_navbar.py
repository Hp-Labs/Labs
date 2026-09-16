path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'Menu, X } from "lucide-react";',
    'Menu, X, Globe } from "lucide-react";'
)

content = content.replace(
    '{ href: "/timeline", label: "Timeline", icon: Zap, isLocked: false },',
    '{ href: "/timeline", label: "Timeline", icon: Zap, isLocked: false },\n  { href: "/public", label: "Public Hub", icon: Globe, isLocked: false },'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added Public Hub to Navbar")
