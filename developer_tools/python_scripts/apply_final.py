import re

with open("original_page.tsx", "r", encoding="utf-16") as f:
    content = f.read()

# ALL CHANGES IN ONE SHOT - precise surgical edits:

# 1. Fix import - named export
content = re.sub(
    r'(import \{ use, useState, useCallback)',
    r'import { SecurePoCUploader } from "@/components/SecurePoCUploader";\n\1',
    content
)

# Also add useEffect to imports
content = content.replace(
    'import { use, useState, useCallback } from "react";',
    'import { use, useState, useCallback, useEffect } from "react";'
)

# 2. Fix handleSubmitFlag to accept isPoC param and handle PoC path
old_fn = '''  const handleSubmitFlag = () => {
    if (flagInput.trim() === uniqueFlag) {
      setFlagResult("correct");
      if (!solved) {
        setSolved(true);
        completeLevel(domainId, severityId, levelNum, lab.id);
        addXP(lab.xpReward);
        if (timerRef) clearInterval(timerRef);
      }
    } else {
      setFlagResult("wrong");
    }
  };'''

new_fn = '''  const handleSubmitFlag = (isPoC: boolean = false) => {
    if (isPoC) {
      if (!solved) {
        setSolved(true);
        setFlagResult("correct");
        completeLevel(domainId, severityId, levelNum, lab.id);
        addXP(lab.xpReward);
        if (timerRef) clearInterval(timerRef);
      }
      return;
    }
    if (flagInput.trim() === uniqueFlag) {
      setFlagResult("correct");
      if (!solved) {
        setSolved(true);
        completeLevel(domainId, severityId, levelNum, lab.id);
        addXP(lab.xpReward);
        if (timerRef) clearInterval(timerRef);
      }
    } else {
      setFlagResult("wrong");
    }
  };'''

if old_fn in content:
    content = content.replace(old_fn, new_fn)
    print("Fixed handleSubmitFlag!")
else:
    print("handleSubmitFlag not found - trying fuzzy")
    match = re.search(r'const handleSubmitFlag = \(\) => \{[\s\S]*?\n  \};', content)
    if match:
        content = content.replace(match.group(0), new_fn)
        print("Fuzzy match replaced!")

# 3. Replace FLAG input with SecurePoCUploader
old_flag = ''') : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="FLAG{...}"
                    value={flagInput}
                    onChange={(e) => { setFlagInput(e.target.value); setFlagResult(null); }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--hp-bg-2)] border border-[var(--hp-border)] text-sm font-mono text-[var(--hp-text)] placeholder-[var(--hp-text-muted)] placeholder-opacity-50 focus:outline-none focus:border-[var(--hp-primary)] transition-all"
                  />
                  {flagResult === "wrong" && (
                    <p className="text-xs text-red-400 font-mono">\u274c Incorrect flag. Keep trying.</p>
                  )}
                  <button
                    onClick={handleSubmitFlag}
                    disabled={!flagInput.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-medium disabled:opacity-40"
                  >
                    <Flag size={13} /> Submit
                  </button>
                </div>
              )}'''

new_flag = ''') : (
                <div className="space-y-2">
                  <SecurePoCUploader onSuccess={() => { handleSubmitFlag(true); }} />
                </div>
              )}'''

if old_flag in content:
    content = content.replace(old_flag, new_flag)
    print("Replaced flag input with SecurePoCUploader!")
else:
    # Find using partial match
    idx = content.find('placeholder="FLAG{...}"')
    if idx != -1:
        block_start = content.rfind(") : (", 0, idx)
        block_end = content.find("              )}", idx) + len("              )}")
        old_block = content[block_start:block_end]
        new_block = new_flag
        content = content[:block_start] + new_block + content[block_end:]
        print("Replaced via partial match!")
    else:
        print("FLAG input not found!")

# 4. Fix if (!unlocked) early return - move it BELOW all hooks
# Find the block
unlocked_match = re.search(r'\n\n  // If locked, render strict Access Denied screen\n\s*if \(!unlocked\) \{[\s\S]*?\n  \}\n', content)
if unlocked_match:
    locked_block = unlocked_match.group(0)
    content = content.replace(locked_block, "\n")
    
    # Add useEffect (session restore) THEN locked block THEN main return
    use_effect = """
  // Restore active session if the user navigates back
  useEffect(() => {
    const labId = lab?.id;
    if (!userId || !labId) return;
    fetch(`/api/labs/${labId}/activity`)
      .then(r => r.json())
      .then(d => {
        if (d.active && d.session) {
          setActive(true);
          const remaining = Math.max(0, Math.floor((d.session.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
          setLabIP(d.session.targetIp || labId);
          setLabDomain(d.session.targetDomain || labId);
          if (remaining > 0) {
            const ref = setInterval(() => {
              setTimeLeft((t) => {
                if (t <= 1) { clearInterval(ref); setActive(false); return 0; }
                return t - 1;
              });
            }, 1000);
            setTimerRef(ref);
          } else {
            setActive(false);
          }
        }
      })
      .catch(() => {});
  }, [userId, lab?.id]);
"""

    # Insert useEffect + locked block right before the main handleActivate
    content = content.replace(
        "  const handleActivate = useCallback(",
        use_effect + locked_block + "\n  const handleActivate = useCallback("
    )
    print("Moved if(!unlocked) BELOW useEffect, ABOVE handleActivate - hooks now all called first!")
else:
    print("if(!unlocked) block not found")

with open("src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("ALL DONE!")
