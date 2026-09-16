footer_code = """
      <footer className="py-8 border-t border-[var(--hp-border)] mt-auto bg-[var(--hp-bg)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-[var(--hp-text)] font-mono">HpLabs</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a 
              href="https://buymeacoffee.com/manivarma3p" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center transition-transform hover:scale-105 opacity-90 hover:opacity-100"
              title="Support HpLabs - Buy Me a Coffee"
            >
              <img 
                src="https://cdn.brandfetch.io/idlFAkJfur/w/192/h/192/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1690821080412" 
                alt="Buy Me A Coffee" 
                className="h-10 w-auto rounded-lg"
              />
            </a>
            <div className="text-[var(--hp-text-muted)] text-sm">
              &copy; {new Date().getFullYear()} HpLabs. From <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="text-[var(--hp-primary)] hover:underline">HackerPlus</a>.
            </div>
          </div>
        </div>
      </footer>"""

for path in ["src/app/leaderboard/page.tsx", "src/app/profile/page.tsx"]:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # insert footer right before `    </div>\n  );\n}`
    target = "    </div>\n  );\n}"
    
    # ensure it's not already there
    if "Support HpLabs - Buy Me a Coffee" not in content:
        content = content.replace(target, footer_code + "\n" + target)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Added footer to {path}")
    else:
        print(f"Footer already exists in {path}")
