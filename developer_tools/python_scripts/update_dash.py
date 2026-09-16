path = "src/app/dashboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Look for the grid or the main content layout
# The dashboard has `<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">`
main_end_match = re.search(r'</main>\n\s*</div>\n\s*</>\n  \);\n\}', content)
if main_end_match:
    main_end = main_end_match.start()
    
    # We will insert a Support card right before </main>
    support_card = """
        {/* Support Section */}
        <div className="mt-8 p-6 rounded-2xl bg-[var(--hp-card-bg)] border border-[var(--hp-border)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-2 relative z-10">
            <h3 className="text-lg font-bold text-[var(--hp-text)] flex items-center gap-2">
              <span className="text-amber-500">\u2615</span> Support HpLabs
            </h3>
            <p className="text-sm text-[var(--hp-text-muted)] max-w-xl">
              Building and maintaining this platform takes time and resources. If you find these labs helpful for your cybersecurity journey, consider supporting the development!
            </p>
          </div>
          <a 
            href="https://buymeacoffee.com/manivarma3p" 
            target="_blank" 
            rel="noopener noreferrer"
            className="shrink-0 transition-transform hover:scale-105 relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <img 
              src="https://logowik.com/content/uploads/images/buy-me-a-coffee7219.logowik.com.webp" 
              alt="Buy Me A Coffee" 
              className="h-12 w-auto rounded-lg"
            />
          </a>
        </div>
"""
    content = content[:main_end] + support_card + content[main_end:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Support Card to Dashboard!")
else:
    print("Dashboard main end not found!")
