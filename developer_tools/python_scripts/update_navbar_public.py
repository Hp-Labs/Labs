path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Define navItems with public access flag
old_nav_items = """const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Terminal, isLocked: false },
  { href: "/timeline", label: "Timeline", icon: Zap, isLocked: false },
  { href: "/public", label: "Public Hub", icon: Globe, isLocked: false },
  { href: "/hardware", label: "Hardware Toolkit", icon: Zap, isLocked: false },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, isLocked: false },
  { href: "/certifications", label: "Certifications", icon: Lock, isLocked: true },
];"""

new_nav_items = """const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Terminal, isLocked: false, public: false },
  { href: "/timeline", label: "Timeline", icon: Zap, isLocked: false, public: true },
  { href: "/public", label: "Public Hub", icon: Globe, isLocked: false, public: true },
  { href: "/hardware", label: "Hardware Toolkit", icon: Zap, isLocked: false, public: true },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, isLocked: false, public: false },
  { href: "/certifications", label: "Certifications", icon: Lock, isLocked: true, public: false },
];"""

content = content.replace(old_nav_items, new_nav_items)

# Now update the rendering loops.
# Desktop:
# {user && (
#   <div className="hidden lg:flex items-center justify-center flex-1 gap-1.5 mx-4">
#     {navItems.map(({ href, label, icon: Icon, isLocked }) => {

desktop_old = """          {/* Nav Links - only when logged in */}
          {user && (
            <div className="hidden lg:flex items-center justify-center flex-1 gap-1.5 mx-4">
              {navItems.map(({ href, label, icon: Icon, isLocked }) => {"""

desktop_new = """          {/* Nav Links - visible based on auth state */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-1.5 mx-4">
            {navItems.filter(item => user ? true : item.public).map(({ href, label, icon: Icon, isLocked }) => {"""

if desktop_old in content:
    content = content.replace(desktop_old, desktop_new)
    # Since we removed {user && (, we must remove the closing )} for this block!
    # Let's use regex to find the exact closing tag for that block.
    # The block ends before `{/* Right side toggles with ample breathing space */}`
    content = content.replace(
        '            </div>\n          )}\n\n          {/* Right side toggles',
        '            </div>\n\n          {/* Right side toggles'
    )
else:
    print("Desktop old not found!")

mobile_old = """        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && user && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-[var(--hp-card-bg)] backdrop-blur-3xl border-b border-[var(--hp-border)] px-4 py-4 flex flex-col gap-2 shadow-2xl">
            {navItems.map(({ href, label, icon: Icon, isLocked }) => {"""

mobile_new = """        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-[var(--hp-card-bg)] backdrop-blur-3xl border-b border-[var(--hp-border)] px-4 py-4 flex flex-col gap-2 shadow-2xl">
            {navItems.filter(item => user ? true : item.public).map(({ href, label, icon: Icon, isLocked }) => {"""

if mobile_old in content:
    content = content.replace(mobile_old, mobile_new)
else:
    print("Mobile old not found!")
    
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Navbar rendering logic for public users.")
