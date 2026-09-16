path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find the early return block
early_return = """  // If locked, render strict Access Denied screen
  if (!unlocked) {
    const userXP = user?.xp ?? 0;
    return (
      <div className="min-h-screen bg-[var(--hp-bg)] flex items-center justify-center p-4">
        <Navbar />
        <div className="max-w-md w-full p-8 bg-[var(--hp-card-bg)] border border-red-500/40 backdrop-blur-2xl rounded-3xl text-center shadow-[0_0_60px_rgba(239,68,68,0.2)]">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--hp-text)] mb-2">Level Locked</h1>
          <p className="text-sm text-[var(--hp-text-muted)] mb-6 leading-relaxed">
            You cannot access this <span className={`font-bold ${cfg.color}`}>{cfg.label}</span> lab directly. You must complete preceding levels and reach the required XP threshold.
          </p>

          <div className="p-4 rounded-xl bg-[var(--hp-bg-3)] border border-[var(--hp-border)] mb-6 text-left space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--hp-text-muted)]">Your Current XP:</span>
              <span className="text-[var(--hp-primary)] font-bold">{userXP.toLocaleString()} XP</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--hp-text-muted)]">Required Severity Tier:</span>
              <span className={`font-bold ${cfg.color}`}>{cfg.label}</span>
            </div>
          </div>

          <Link
            href={`/red-team/pentesting/${domainId}`}
            className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-[var(--hp-text)] transition-all shadow-[0_0_20px_var(--hp-primary)] hover:shadow-[0_0_30px_var(--hp-primary)]"
            style={{ background: "linear-gradient(135deg, var(--hp-primary-dim), var(--hp-primary))" }}
          >
             Return to Domain Overview
          </Link>
        </div>
      </div>
    );
  }
"""

if early_return.strip() in content:
    # Remove it from its current location
    content = content.replace(early_return, "")
    
    # We want to place it right before `return (` which is the main render
    main_return_idx = content.find("  return (\n    <div className=\"min-h-screen")
    if main_return_idx != -1:
        content = content[:main_return_idx] + early_return + "\n" + content[main_return_idx:]
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed early return")
else:
    print("Could not find exact early return string. Using regex.")
    
    import re
    match = re.search(r'// If locked.*?return\s*\(.*?</Link>\s*</div>\s*</div>\s*\);\s*\}', content, re.DOTALL)
    if match:
        block = match.group(0)
        content = content.replace(block, "")
        main_return_idx = content.find("  return (\n    <div className=\"min-h-screen bg-[var(--hp-bg)]\" suppressHydrationWarning>")
        if main_return_idx != -1:
            content = content[:main_return_idx] + block + "\n\n" + content[main_return_idx:]
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print("Fixed early return via regex")
        else:
            print("Could not find main return")
    else:
        print("Regex for block failed")

