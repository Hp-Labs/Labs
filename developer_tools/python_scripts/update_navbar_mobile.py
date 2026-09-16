import os
import re

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add Menu, X to lucide-react imports
c = c.replace('} from "lucide-react";', ', Menu, X } from "lucide-react";')

# Add state for mobile menu
c = c.replace('export default function Navbar() {\n  const pathname = usePathname();', 'import { useState } from "react";\n\nexport default function Navbar() {\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const pathname = usePathname();')

# Add mobile menu toggle button inside the right-side toggles, visible only on small screens
mobile_toggle = '''
                {/* Mobile Menu Toggle */}
                <button 
                  className="lg:hidden flex items-center justify-center p-2 rounded-md text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-border)]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
'''
# Insert before Logout
c = c.replace('{/* Logout */}', mobile_toggle + '\n                {/* Logout */}')

# Add the actual mobile dropdown menu at the end of the nav
mobile_dropdown = '''
      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[var(--hp-card-bg)] backdrop-blur-3xl border-b border-[var(--hp-border)] px-4 py-4 flex flex-col gap-2 shadow-2xl">
          {navItems.map(({ href, label, icon: Icon, isLocked }) => {
            const isActive = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={lex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 }
              >
                <Icon size={16} className={isLocked ? "text-yellow-400/80" : ""} />
                <span>{label}</span>
                {isLocked && (
                  <span className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    LOCKED
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
'''
c = c.replace('</nav>', mobile_dropdown + '\n    </nav>')

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Navbar mobile menu added.")
