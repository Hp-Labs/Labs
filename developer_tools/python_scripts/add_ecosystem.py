path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the Footer section to insert right above it
footer_idx = content.find("      {/* Footer */}")
if footer_idx == -1:
    footer_idx = content.find("<footer")

new_section = """
      {/* Ecosystem / HackerPlus Section */}
      <section className="relative py-24 z-10 bg-[var(--hp-bg)] border-t border-[var(--hp-border)] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] bg-[var(--hp-primary)]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">The <span className="text-[var(--hp-primary)]">HackerPlus</span> Ecosystem</h2>
            <p className="text-[var(--hp-text-muted)] max-w-2xl mx-auto">
              HpLabs is just the beginning. Explore our complete cybersecurity training environment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* HackerPlus Card */}
            <div className="relative group p-8 rounded-2xl bg-[var(--hp-card-bg)] border border-[var(--hp-border)] hover:border-[var(--hp-primary)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--hp-primary)]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)] flex items-center justify-center mb-6 group-hover:border-[var(--hp-primary)]/50 transition-colors">
                  <Shield className="text-[var(--hp-text-muted)] group-hover:text-[var(--hp-primary)] transition-colors" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-mono">HackerPlus</h3>
                <p className="text-[var(--hp-text-muted)] mb-6 text-sm leading-relaxed">
                  The parent platform behind HpLabs. HackerPlus is India's premier cybersecurity training ecosystem, offering professional courses, certifications, and real-world skills to turn beginners into elite hackers.
                </p>
                <a 
                  href="https://hackerplus.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--hp-text)] hover:text-[var(--hp-primary)] transition-colors"
                >
                  Visit HackerPlus.in <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* HPVuln Card */}
            <div className="relative group p-8 rounded-2xl bg-[var(--hp-card-bg)] border border-[var(--hp-border)] hover:border-[var(--hp-cyan)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--hp-cyan)]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)] flex items-center justify-center mb-6 group-hover:border-[var(--hp-cyan)]/50 transition-colors">
                  <Target className="text-[var(--hp-text-muted)] group-hover:text-[var(--hp-cyan)] transition-colors" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-mono">HPVuln Target</h3>
                <p className="text-[var(--hp-text-muted)] mb-6 text-sm leading-relaxed">
                  Want to test your skills in the wild? Try HPVuln, our completely free, intentionally vulnerable web application. Anyone can legally pentest this site to practice real-world exploits safely.
                </p>
                <a 
                  href="https://hpvuln.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--hp-text)] hover:text-[var(--hp-cyan)] transition-colors"
                >
                  Hack HPVuln.in <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

"""

if footer_idx != -1:
    content = content[:footer_idx] + new_section + content[footer_idx:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Ecosystem section successfully.")
else:
    print("Could not find footer in page.tsx")
