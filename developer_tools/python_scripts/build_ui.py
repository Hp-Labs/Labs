import re
path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. CheckCircle, XCircle
content = content.replace("CheckCircle,", "CheckCircle, XCircle,")

# 2. Add failed/penalty state
if "const [failed, setFailed] = useState(false);" not in content:
    content = content.replace(
        "const [active, setActive] = useState(false);", 
        "const [active, setActive] = useState(false);\n  const [failed, setFailed] = useState(false);\n  const [timeoutPenalty, setTimeoutPenalty] = useState(0);"
    )

# 3. Update the timer block
old_timer = """            const ref = setInterval(() => {
              setTimeLeft((t) => {
                if (t <= 1) { clearInterval(ref); setActive(false); return 0; }
                return t - 1;
              });
            }, 1000);"""
new_timer = """            const ref = setInterval(() => {
              setTimeLeft((t) => {
                if (t <= 1) { 
                  clearInterval(ref); 
                  setActive(false); 
                  setFailed(true);
                  fetch(`/api/labs/${lab?.id}/activity`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "timeout", sessionId: data.session.labSessionId, userId })
                  }).then(r => r.json()).then(d => { if(d.penalty) setTimeoutPenalty(d.penalty); }).catch(e => console.error(e));
                  return 0; 
                }
                return t - 1;
              });
            }, 1000);"""
content = content.replace(old_timer, new_timer)
content = content.replace("setActivating(true);", "setActivating(true); setFailed(false);")

# 4. Remove Terminate button
term_pattern = r'<button\s*onClick=\{handleStop\}[\s\S]*?Terminate Engagement\s*</button>'
content = re.sub(term_pattern, "", content)

# 5. Remove right panel !active box
right_panel_pattern = r'\{!active \? \([\s\S]*?\) : \(\s*(<div)'
content = re.sub(right_panel_pattern, r"{active && (\n                \1", content)

# 6. Wrap grid
grid_start = '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">'
overlays = """
        <div className="relative w-full h-full min-h-[500px]">
          {!active && !solved && !failed && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl">
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

          {solved && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#050508]/80 backdrop-blur-md">
               <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-green-500/50 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.3)] max-w-md w-full">
                 <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle size={50} className="text-green-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Target Compromised!</h2>
                 <p className="text-green-400 font-mono text-xl mb-4">+{xpAward?.total || lab.xpReward} XP Awarded</p>
                 <p className="text-gray-400 text-sm">Lab completed successfully. You can safely exit.</p>
               </div>
            </div>
          )}

          {failed && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#050508]/80 backdrop-blur-md">
               <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-red-500/50 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.3)] max-w-md w-full">
                 <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <XCircle size={50} className="text-red-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Engagement Failed</h2>
                 <p className="text-red-400 font-mono text-xl mb-4">-{timeoutPenalty || 50} XP Penalty</p>
                 <p className="text-gray-400 text-sm">Time expired before PoC was verified. System locked.</p>
               </div>
            </div>
          )}

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${!active && !solved && !failed ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}>
"""

content = content.replace(grid_start, overlays)

# Add closing tag for relative wrapper
closing_pattern = r'(\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*\);\s*\})'
content = re.sub(closing_pattern, r'\n        </div>\1', content, count=1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Applied exact rewrites successfully!")
