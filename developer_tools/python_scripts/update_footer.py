path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_footer = """<footer className="py-12 border-t border-[var(--hp-border)] bg-[var(--hp-bg)] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/hplabs-logo.png" alt="HpLabs Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_var(--hp-primary)]" />
            <span className="text-xl font-bold tracking-tight text-[var(--hp-text)] font-mono">HpLabs</span>
          </div>
          
          <div className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} HpLabs. From <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="text-[var(--hp-primary)] hover:underline">HackerPlus</a>.
          </div>
        </div>
      </footer>"""

new_footer = """<footer className="py-12 border-t border-[var(--hp-border)] bg-[var(--hp-bg)] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/hplabs-logo.png" alt="HpLabs Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_var(--hp-primary)]" />
            <span className="text-xl font-bold tracking-tight text-[var(--hp-text)] font-mono">HpLabs</span>
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
                src="https://logowik.com/content/uploads/images/buy-me-a-coffee7219.logowik.com.webp" 
                alt="Buy Me A Coffee" 
                className="h-10 w-auto rounded-lg"
              />
            </a>
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} HpLabs. From <a href="https://hackerplus.in" target="_blank" rel="noopener noreferrer" className="text-[var(--hp-primary)] hover:underline">HackerPlus</a>.
            </div>
          </div>
        </div>
      </footer>"""

if old_footer in content:
    content = content.replace(old_footer, new_footer)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Buy Me a Coffee to landing page footer!")
else:
    print("Footer not found for replacement!")
