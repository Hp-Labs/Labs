import os
import re

# 1. Update Navbar layout (left/center/right) and remove Premium Badge
path = 'src/components/Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'\{\/\* Premium Badge \/ Upgrade Button \*\/\}.*?\{\/\* Profile \*\/\}', '{/* Profile */}', c, flags=re.DOTALL)
c = c.replace('<div className="flex items-center justify-between h-16">', '<div className="flex items-center justify-between h-16">')
c = c.replace('className="flex items-center gap-3 group shrink-0"', 'className="flex items-center gap-3 group shrink-0 lg:w-1/4"')
c = c.replace('className="hidden lg:flex items-center gap-1.5 mx-4"', 'className="hidden lg:flex items-center justify-center flex-1 gap-1.5 mx-4"')
c = c.replace('className="flex items-center gap-2 sm:gap-3 shrink-0"', 'className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 lg:w-1/4"')
c = c.replace('max-w-[1440px] mx-auto px-6 lg:px-12', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')

# Add mobile menu logic
c = c.replace('} from "lucide-react";', ', Menu, X } from "lucide-react";')
c = c.replace('export default function Navbar() {\n  const pathname = usePathname();', 'import { useState } from "react";\n\nexport default function Navbar() {\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const pathname = usePathname();')

mobile_toggle = """
                {/* Mobile Menu Toggle */}
                <button 
                  className="lg:hidden flex items-center justify-center p-2 rounded-md text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-border)]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
"""
c = c.replace('{/* Logout */}', mobile_toggle + '\n                {/* Logout */}')

mobile_dropdown = """
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--hp-border)] text-[var(--hp-primary)] border border-[var(--hp-border-hover)]"
                    : isLocked
                    ? "text-[var(--hp-text-muted)] opacity-70"
                    : "text-[var(--hp-text-muted)] hover:text-[var(--hp-text)] hover:bg-[var(--hp-border)]"
                }`}
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
"""
c = c.replace('</nav>', mobile_dropdown + '\n    </nav>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Navbar restored and fixed!")

# 2. Update Profile layout
path = 'src/app/profile/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

new_header = """          {/* Header Profile Card */}
          <div className="bg-[var(--hp-bg-2)] border border-[var(--hp-border)] rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl mb-6 relative overflow-hidden">
            
            {/* Rank watermark background */}
            <div className="absolute -right-8 -top-8 text-6xl opacity-5 pointer-events-none font-bold italic rotate-12">
              {CURRENT_RANK.rank}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              
              {/* Column 1: Identity */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--hp-bg-3)] border-2 border-[var(--hp-primary)] flex items-center justify-center text-3xl shadow-[0_0_15px_var(--hp-primary)]/20">
                    \\U0001F47E
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-[var(--hp-text)] tracking-tight">{user.username}</h1>
                    <div className="text-sm font-mono text-[var(--hp-text-muted)] flex items-center gap-1.5 mt-1">
                      <AtSign size={12}/> HPLabs ID: {user.id}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-2 text-sm font-mono text-[var(--hp-text-muted)]">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[var(--hp-primary)]" />
                    {user.email || "No email linked"}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[var(--hp-primary)]" />
                    {user.phone && user.phone !== "0000000000" ? user.phone : "No phone linked"}
                  </div>
                </div>
              </div>

              {/* Column 2: Plan & Status */}
              <div className="flex flex-col justify-center gap-3 md:border-l md:border-[var(--hp-border)] md:pl-8">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[var(--hp-text-muted)] mb-1">Current Plan</h3>
                  {user.isPremium ? (
                    <div className="flex flex-col gap-1">
                      <div className="inline-flex items-center gap-1.5 font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-md w-fit">
                        <Star size={14} className="fill-current" />
                        PREMIUM
                      </div>
                      {user.premiumUntil && (
                        <div className="text-xs font-mono text-[var(--hp-text-muted)] mt-1 flex items-center gap-1">
                          <Calendar size={12}/> Expires: {new Date(user.premiumUntil).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 font-bold text-[var(--hp-text)] bg-[var(--hp-border)] px-3 py-1 rounded-md w-fit">
                      FREE PLAN
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs font-mono text-[var(--hp-text-muted)] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Account Active
                </div>
              </div>

              {/* Column 3: Stats */}
              <div className="flex flex-col justify-center gap-4 lg:border-l lg:border-[var(--hp-border)] lg:pl-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[var(--hp-text-muted)] mb-1">Level</h3>
                    <div className="font-bold text-[var(--hp-text)] text-lg flex items-center gap-2">
                      <Trophy size={16} className="text-[var(--hp-primary)]" />
                      {CURRENT_RANK.rank}
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs uppercase tracking-wider text-[var(--hp-text-muted)] mb-1">XP</h3>
                    <div className="font-mono font-bold text-[var(--hp-primary)] text-lg glow-text">
                      {xp.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="h-1.5 bg-[var(--hp-bg)] rounded-full overflow-hidden mb-1.5 border border-[var(--hp-border)]">
                    <div className="h-full bg-[var(--hp-primary)] relative" style={{ width: `${xpProgress}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[var(--hp-text-muted)]">
                    <span>{xp.toLocaleString()} XP</span>
                    <span>{NEXT_RANK !== CURRENT_RANK ? `${NEXT_RANK.minXP.toLocaleString()} XP` : "Max"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--hp-border)] pt-3">
                   <h3 className="text-xs uppercase tracking-wider text-[var(--hp-text-muted)]">Labs Completed</h3>
                   <span className="font-mono font-bold text-[var(--hp-text)] bg-[var(--hp-border)] px-2 py-0.5 rounded text-sm">
                     {completedLabsList.length}
                   </span>
                </div>
              </div>

            </div>
          </div>"""

# Replace exactly
c = re.sub(r'\{\/\*\s*Header Profile Card\s*\*\/\}.*?(?=<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">)', new_header + '\n\n          ', c, flags=re.DOTALL)
c = c.replace('text-9xl', 'text-6xl')
c = c.replace('text-8xl', 'text-6xl')
c = c.replace('max-w-6xl', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Profile restored and fixed!")

