path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add XCircle to lucide-react imports
if "XCircle" not in content:
    content = content.replace("CheckCircle,", "CheckCircle, XCircle,")

# 2. Add new states
state_injection = """
  const [failed, setFailed] = useState(false);
  const [timeoutPenalty, setTimeoutPenalty] = useState(0);
"""
if "const [failed, setFailed]" not in content:
    content = content.replace("const [active, setActive] = useState(false);", state_injection + "  const [active, setActive] = useState(false);")

# 3. Modify useEffect timer interval
old_interval = """            const ref = setInterval(() => {
              setTimeLeft((t) => {
                if (t <= 1) { clearInterval(ref); setActive(false); return 0; }
                return t - 1;
              });
            }, 1000);"""

new_interval = """            const ref = setInterval(() => {
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
content = content.replace(old_interval, new_interval)

# 4. Modify handleActivate response slightly? Not needed.
# But wait, when handleActivate returns, we might want to ensure failed is false.
content = content.replace("setActivating(true);", "setActivating(true); setFailed(false);")

# 5. Remove right-side "Activate Lab" panel
old_right_panel = """          {/* Target Connectivity / Action Card */}
          <div className="bg-[var(--hp-card-bg)] border border-[var(--hp-border)] rounded-2xl p-6 shadow-xl mb-6">
            {!active ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--hp-primary)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--hp-primary)]/20 shadow-[0_0_15px_rgba(191,95,255,0.1)]">
                  <Play size={32} className="text-[var(--hp-primary)]" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Activate Lab</h3>
                <p className="text-sm text-[var(--hp-text-muted)] mb-6">Get a unique target IP. Attack from your own Kali/Parrot Linux.</p>
                <button
                  onClick={handleActivate}
                  disabled={activating}
                  className="w-full py-3 rounded-xl btn-primary font-bold shadow-[0_0_20px_var(--hp-primary)] hover:shadow-[0_0_30px_var(--hp-primary)] flex items-center justify-center gap-2"
                >
                  {activating ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                  Activate Lab
                </button>
              </div>
            ) : ("""

new_right_panel = """          {/* Target Connectivity / Action Card */}
          {active && (
            <div className="bg-[var(--hp-card-bg)] border border-[var(--hp-border)] rounded-2xl p-6 shadow-xl mb-6">"""

content = content.replace(old_right_panel, new_right_panel)

# Fix the closing brace of the right panel `) : (`
old_right_panel_close = """                 </div>
               )}
            </div>
          </div>"""
new_right_panel_close = """                 </div>
               )}
            </div>
          )}"""
# Wait, let's just do a manual string replace or regex. The right panel is tricky because it has a lot of content.
# Better to use a simpler replace.
