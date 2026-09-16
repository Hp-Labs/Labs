path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

upgrade_btn = """
                {/* Upgrade Button */}
                <Link
                  href="/pricing"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--hp-primary)]/50 bg-[var(--hp-primary)]/10 hover:bg-[var(--hp-primary)]/20 hover:border-[var(--hp-primary)] text-[var(--hp-primary)] transition-all shadow-[0_0_10px_rgba(0,255,65,0.1)] hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                >
                  <Sparkles size={13} className="animate-pulse" />
                  <span className="text-xs font-bold tracking-wide">UPGRADE</span>
                </Link>
"""

content = content.replace(
    "{/* Streak Counter */}",
    upgrade_btn + "\n                {/* Streak Counter */}"
)

# For logged-out users, let's also add it next to the "Start Free" or something.
# Search for `href="/register"`
logout_section_match = content.find('href="/register"')
if logout_section_match != -1:
    content = content.replace(
        '<Link href="/login"',
        """<Link href="/pricing" className="hidden sm:inline-flex text-xs font-bold text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] mr-2 transition-colors">Pricing</Link>\n                <Link href="/login" """
    )

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added Upgrade button to Navbar!")
