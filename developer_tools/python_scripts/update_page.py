path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Update states and hooks
content = re.sub(
    r'const \[activating, setActivating\] = useState\(false\);',
    'const [activating, setActivating] = useState(false);\n  const [isModalOpen, setIsModalOpen] = useState(true);\n  const [labSessionId, setLabSessionId] = useState<string | null>(null);',
    content
)

# 2. Update initial load effect to fetch active session
old_effect = """  useEffect(() => {
    // If not locked by severity, mark it "ready to activate"
    // Wait, this is handled by handleActivate instead.
  }, []);"""
  
new_effect = """  useEffect(() => {
    // Check if session exists on backend
    fetch(`/api/labs/${lab.id}/session`)
      .then(res => res.json())
      .then(data => {
        if (data.active) {
          setLabIP(data.targetIp || "10.10.x.x");
          setLabDomain(data.targetDomain || "target.hpvuln.in");
          setLabSessionId(data.labSessionId);
          setActive(true);
          setIsModalOpen(false);
          const remaining = Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
        }
      })
      .catch(console.error);
  }, [lab.id]);"""

if old_effect in content:
    content = content.replace(old_effect, new_effect)
else:
    # Just inject it before the timer effect
    timer_effect_idx = content.find("useEffect(() => {\n    if (!active || timeLeft <= 0) return;")
    if timer_effect_idx != -1:
        content = content[:timer_effect_idx] + new_effect + "\n\n  " + content[timer_effect_idx:]

# 3. Update timer effect to use standard interval but it relies on timeLeft being set
# Wait, we should probably calculate it properly using expiresAt if we had it, but standard decrement is okay if initialized correctly, 
# except we must ensure it doesn't drift. For now, initializing from backend is step 1.

# 4. Update handleActivate to call backend
old_handle_activate = """  const handleActivate = useCallback(() => {
    setActivating(true);
    setTimeout(() => {
      const ip = randomIP();
      const dom = randomDomain(lab.id);
      setLabIP(ip);
      setLabDomain(dom);
      setActive(true);
      setActivating(false);
      setTimeLeft(lab.timeLimitMinutes * 60);
      const ref = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(ref); setActive(false); return 0; }
          return t - 1;
        });
      }, 1000);
      setTimerRef(ref);
    }, 1500);
  }, [lab.id, lab.timeLimitMinutes]);"""

new_handle_activate = """  const handleActivate = useCallback(async () => {
    setActivating(true);
    try {
      const res = await fetch(`/api/labs/${lab.id}/activate`, { method: "POST" });
      const data = await res.json();
      
      if (data.success) {
        setLabIP(data.targetIp);
        setLabDomain(data.targetDomain);
        setLabSessionId(data.labSessionId);
        setActive(true);
        setIsModalOpen(false);
        const remaining = Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActivating(false);
    }
  }, [lab.id]);"""

content = content.replace(old_handle_activate, new_handle_activate)

# 5. Fix timer clearing on active=false
# The existing timer effect handles decrementing timeLeft.

# 6. Add modal UI wrapping
# The main return starts with:
# return (
#    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans text-gray-100">
#      <Navbar user={user} />

old_return = """  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans text-gray-100">
      <Navbar user={user} />"""

modal_jsx = """
      {/* Activate Lab Modal Overlay */}
      {!active && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto" />
          
          <div className="relative z-10 w-full max-w-md bg-[#0b0614] border border-[rgba(191,95,255,0.2)] rounded-3xl p-8 shadow-[0_0_60px_rgba(191,95,255,0.15)] flex flex-col items-center text-center overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[#9333ea]/20 to-transparent pointer-events-none" />
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <Shield className="text-[var(--hp-primary)]" size={28} />
              <div className="flex flex-col items-start">
                <span className="font-bold text-xl leading-none tracking-tight font-mono text-white">HpLabs</span>
                <span className="text-[10px] text-[var(--hp-text-muted)] font-mono">by HackerPlus</span>
              </div>
            </div>

            {/* Target Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#bf5fff]/20 blur-xl rounded-full" />
              <Target size={64} className="relative text-white opacity-90" strokeWidth={1.5} />
              {/* Corner brackets */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#bf5fff]/50" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#bf5fff]/50" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#bf5fff]/50" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#bf5fff]/50" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Activate Lab</h2>
            <p className="text-sm text-gray-300 font-medium mb-4">Get a unique target environment</p>
            <p className="text-xs text-gray-400 mb-8 max-w-[280px]">
              This will start your lab environment. Attack from your own Kali/Parrot Linux and complete the objectives.
            </p>

            <button
              onClick={handleActivate}
              disabled={activating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#bf5fff] to-[#9333ea] text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {activating ? (
                <RefreshCw className="animate-spin" size={24} />
              ) : (
                <Play size={24} fill="currentColor" />
              )}
              Activate Lab
            </button>

            <div className="mt-6 flex items-start gap-2 text-left">
              <Info size={16} className="text-gray-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500">
                Once activated, the timer will start and the lab environment will be reserved for you.
              </p>
            </div>
          </div>
        </div>
      )}
"""

# To make the background non-interactive when modal is open and not active,
# we can wrap the main content area with a class conditionally.
new_return = """  return (
    <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col font-sans text-gray-100">
      <Navbar user={user} />
""" + modal_jsx + """
      {/* Main Content Area */}
      <main className={`flex-1 relative ${(!active && isModalOpen) ? 'pointer-events-none blur-[4px] select-none overflow-hidden h-screen' : ''}`}>
"""

content = content.replace(old_return, new_return)
# Need to close the </main> right before the last closing </div>
content = re.sub(r'(\s*)</div>\s*\)\s*;\s*\}\s*$', r'\1  </main>\n\1</div>\n  );\n}', content)


with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated page.tsx with Modal and Backend Sync")
