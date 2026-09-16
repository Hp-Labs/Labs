path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. FIX LiveEngagementScreen
deploy_target_pattern = r'\{!active && !failed && !showSuccess && \([\s\S]*?Activate Lab\n\s*</button>\n\s*</div>\n\s*</div>\n\s*\)\}'
content = re.sub(deploy_target_pattern, '', content)

content = content.replace("className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${!active ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}", "className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${(showSuccess || failed) ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}")

# 2. FIX NormalPreLabScreen
normal_grid_pattern = r'<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mt-6">'
normal_replacement = """<div className="relative w-full h-full min-h-[500px]">
          {!active && !failed && !showSuccess && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl mt-6">
              <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-[var(--hp-primary)]/50 rounded-3xl shadow-[0_0_50px_rgba(191,95,255,0.3)] max-w-sm w-full transform transition-all hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-[var(--hp-primary)]/20 flex items-center justify-center mx-auto mb-6 border border-[var(--hp-primary)]/30">
                  <Play size={40} className="text-[var(--hp-primary)] ml-2" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Deploy Target</h2>
                <p className="text-sm text-gray-400 mb-8">Launch a dedicated instance for this vulnerability. Timer begins immediately upon deployment.</p>
                <button
                  onClick={handleActivate}
                  disabled={activating}
                  className="w-full py-4 rounded-xl btn-primary font-bold shadow-[0_0_30px_var(--hp-primary)] hover:shadow-[0_0_50px_var(--hp-primary)] flex items-center justify-center gap-2 text-lg"
                >
                  {activating ? <RefreshCw size={24} className="animate-spin" /> : <Play size={24} />}
                  Activate Lab
                </button>
              </div>
            </div>
          )}
          <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mt-6 ${!active ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}>"""
content = content.replace(normal_grid_pattern, normal_replacement)

end_pattern = r'(      </div>\n    </div>\n  \);\n\})'
content = re.sub(end_pattern, r'      </div>\n\n      </div>\n    </div>\n  );\n}', content)

# 3. FIX OVERLAY LOGIC
content = content.replace("setShowSuccess(true);\n              setActive(false);", "setShowSuccess(true);")
content = content.replace("if (t <= 1) { \n                  clearInterval(ref); \n                  setActive(false); \n                  setFailed(true);", "if (t <= 1) { \n                  clearInterval(ref); \n                  setFailed(true);")
content = content.replace("onClick={() => setShowSuccess(false)}", "onClick={() => { setShowSuccess(false); setActive(false); }}")
content = content.replace("onClick={() => setFailed(false)}", "onClick={() => { setFailed(false); setActive(false); }}")


# 4. ADD useEffect for Restoring Session
content = re.sub(r'import\s+\{\s*(.*?)\s*\}\s+from\s+"react";', lambda m: f"import {{ {m.group(1)}{', useEffect' if 'useEffect' not in m.group(1) else ''} }} from \"react\";", content)

use_effect_block = """  // Restore active session if exists
  useEffect(() => {
    if (!userId || !lab?.id) return;
    fetch(`/api/labs/${lab?.id}/activity`)
      .then(r => r.json())
      .then(d => {
        if (d.active && d.session) {
          setLabSessionId(d.session.labSessionId);
          setActive(true);
          const remaining = Math.max(0, Math.floor((d.session.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
          const ip = TARGET_CONFIG.ip;
          const dom = TARGET_CONFIG.domain;
          setLabIP(ip);
          setLabDomain(dom);
          
          if (remaining > 0) {
            const ref = setInterval(() => {
              setTimeLeft((t) => {
                if (t <= 1) {
                  clearInterval(ref);
                  setFailed(true);
                  fetch(`/api/labs/${lab?.id}/activity`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "timeout", sessionId: d.session.labSessionId, userId })
                  }).then(r => r.json()).then(res => { if(res.penalty) setTimeoutPenalty(res.penalty); }).catch(console.error);
                  return 0;
                }
                return t - 1;
              });
            }, 1000);
            setTimerRef(ref);
          } else {
             setFailed(true);
          }
        }
      })
      .catch(console.error);
  }, [userId, lab?.id]);

"""
content = content.replace("  const handleActivate = useCallback(async () => {", use_effect_block + "  const handleActivate = useCallback(async () => {")


# 5. COPY Left Column (Tabs) from Normal to Live
# The Live Screen currently has `<div className="lg:col-span-2 space-y-6"> ... </div>` which lacks tabs.
# The Normal Screen has a large `<div className="space-y-6">` that starts after `{/*  LEFT: Lab Content  */}`
# Let's extract the normal screen left column exact substring using regex with robust boundaries:
start_left = content.find('{/*  LEFT: Lab Content  */}')
# Find the end of this div block. We know it ends with `</div>` right before `{/* Right Panel */}`? No right panel.
# It ends right before `</div>\n      </div>\n\n      </div>\n    </div>\n  );\n}`
end_left = content.rfind('</div>\n      </div>\n\n      </div>\n    </div>\n  );\n}')
normal_left_col = content[start_left:end_left]
# But `normal_left_col` has `<div className="space-y-6">` at the start.
normal_left_col = normal_left_col.replace('<div className="space-y-6">', '<div className="lg:col-span-2 space-y-6">', 1)

# Now find the Live Screen Left Column to replace:
live_left_match = re.search(r'(<div className="lg:col-span-2 space-y-6">[\s\S]*?)\{\/\* Right Column - Target & Actions \*\/\}', content)
if live_left_match:
    content = content.replace(live_left_match.group(1), normal_left_col + "\n              ")
else:
    print("Could not find Live left column")


with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("All fixes applied successfully!")
