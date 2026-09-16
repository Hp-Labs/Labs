import os
import re

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
                    \U0001F47E
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

c = re.sub(r'\{\/\*\s*Header Profile Card\s*\*\/\}.*?(?=<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">)', lambda m: new_header + '\n\n          ', c, flags=re.DOTALL)
c = c.replace('text-9xl', 'text-6xl')
c = c.replace('text-8xl', 'text-6xl')
c = c.replace('max-w-6xl mx-auto', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
c = c.replace('\\U0001F47E', '\U0001F47E')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Profile restored and fixed!")
