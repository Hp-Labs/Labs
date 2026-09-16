path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Add link for Hardware in Right side toggles
right_side_anchor = "{/* Right side toggles with ample breathing space */}"
hardware_link = """
          <Link href="/hardware" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--hp-primary)]/40 bg-[var(--hp-primary)]/10 hover:bg-[var(--hp-primary)]/20 text-[var(--hp-primary)] transition-all text-xs font-medium mr-2">
            <Zap size={13} />
            <span>Hardware Toolkit</span>
          </Link>
"""

c = c.replace(right_side_anchor, hardware_link + "\n          " + right_side_anchor)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
