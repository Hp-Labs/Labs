import os

path = "src/app/profile/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace the Main profile card JSX
old_card = c[c.find('{/* Main profile card */}'):c.find('{/* Detailed Stats Column */}')]

new_card = """{/* Main profile card */}
          <div className="md:col-span-1 space-y-6">
            <div className="lab-card rounded-3xl p-6 relative overflow-hidden group border border-[var(--hp-border)] bg-[var(--hp-bg-2)]">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-[var(--hp-bg-3)] border-2 border-[var(--hp-border-hover)] flex items-center justify-center text-3xl overflow-hidden group-hover:border-[var(--hp-primary)] transition-colors">
                    {/* Avatar placeholder */}
                    <div className="font-mono font-bold text-[var(--hp-text-muted)]">{username.substring(0, 2).toUpperCase()}</div>
                  </div>
                </div>

                <div className="text-center w-full">
                  <h1 className="text-xl font-bold text-[var(--hp-text)]">{user?.name || "Hacker"}</h1>
                  <p className="text-[var(--hp-primary)] font-mono text-sm mb-4">@{username}</p>

                  <div className="space-y-2 text-left bg-[var(--hp-bg-3)] p-4 rounded-xl border border-[var(--hp-border-hover)] mb-4 w-full">
                    <div className="flex justify-between items-center text-xs border-b border-[var(--hp-border)] pb-2 mb-2">
                      <span className="text-[var(--hp-text-muted)]">User ID</span>
                      <span className="font-mono text-white">{user?.id || "HP-00000000"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-[var(--hp-border)] pb-2 mb-2">
                      <span className="text-[var(--hp-text-muted)]">Email</span>
                      <span className="font-mono text-white">{user?.email || "guest@hplabs.local"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-[var(--hp-border)] pb-2 mb-2">
                      <span className="text-[var(--hp-text-muted)]">Phone</span>
                      <span className="font-mono text-white">{user?.phone || "Not Verified"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--hp-text-muted)]">Current Plan</span>
                      {user?.isPremium ? (
                        <div className="text-right">
                          <span className="font-mono text-[var(--hp-primary)] font-bold">PREMIUM</span>
                          {user?.premiumUntil && (
                            <div className="text-[9px] text-[var(--hp-text-muted)] mt-0.5">
                              Expires: {new Date(user.premiumUntil).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="font-mono text-[var(--hp-text-muted)] font-bold">FREE PLAN</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)]">
                      <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Rank</div>
                      <div className="text-xs font-bold text-[var(--hp-primary)] truncate">{rankBadge.primaryTag}</div>
                    </div>
                    <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)]">
                      <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Experience</div>
                      <div className="text-xs font-bold font-mono text-white">{xp.toLocaleString()} XP</div>
                    </div>
                    <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)]">
                      <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Labs Done</div>
                      <div className="text-xs font-bold font-mono text-white">{user?.completedLabs?.length || 0}</div>
                    </div>
                    <div className="bg-[var(--hp-bg-3)] p-3 rounded-xl border border-[var(--hp-border)]">
                      <div className="text-[10px] text-[var(--hp-text-muted)] uppercase mb-1">Day Streak</div>
                      <div className="text-xs font-bold font-mono text-orange-400 flex items-center justify-center gap-1">
                        <Flame size={12} /> {user?.loginStreak || 1}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          """

c = c.replace(old_card, new_card)
with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated Profile Card")
