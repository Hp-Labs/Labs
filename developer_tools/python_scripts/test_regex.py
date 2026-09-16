import re
path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the right side "Activate Lab" and leave just the Target Connectivity
pattern_right_panel = r'\{!active \? \([\s\S]*?\) : \(\s*(<div className="space-y-4">[\s\S]*?)</div>\s*\)\}'
replacement = r'{active && (\n            \1\n          )}'

content, count = re.subn(pattern_right_panel, replacement, content)
print(f"Replaced right panel: {count}")

# Remove Terminate Engagement button block
pattern_terminate = r'<button\s*onClick=\{handleStop\}[\s\S]*?Terminate Engagement\s*</button>'
content, count2 = re.subn(pattern_terminate, "", content)
print(f"Removed Terminate button: {count2}")

# Add the Blur Overlay and central activate button
# We need to wrap the whole `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"> ... </div>` inside the layout?
# Actually just wrap the inner grid!
# The grid starts with: `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`
pattern_grid = r'(<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">)'
# We will inject the relative container and overlays right before this.
overlays = """
        <div className="relative">
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
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#00000088] backdrop-blur-sm">
               <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-green-500/50 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                 <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle size={50} className="text-green-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Target Compromised!</h2>
                 <p className="text-green-400 font-mono text-lg mb-2">+{xpAward?.total || lab.xpReward} XP Awarded</p>
                 <p className="text-gray-400 text-sm">Lab completed successfully.</p>
               </div>
            </div>
          )}

          {failed && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#00000088] backdrop-blur-sm">
               <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-red-500/50 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                 <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <XCircle size={50} className="text-red-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Engagement Failed</h2>
                 <p className="text-red-400 font-mono text-lg mb-2">-{timeoutPenalty || 50} XP Penalty</p>
                 <p className="text-gray-400 text-sm">Time expired before PoC was verified.</p>
               </div>
            </div>
          )}

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 ${!active && !solved && !failed ? 'opacity-20 blur-md pointer-events-none' : ''}`}>
"""

content = re.sub(pattern_grid, overlays, content)

# We need to close the `<div className="relative">` after the grid ends!
# The grid ends exactly before `</div>\n    </div>\n  );\n}`
pattern_grid_close = r'(</div>\n    </div>\n  );\n})'
# Let's find the closing of the `grid` which is inside `max-w-7xl`
# Actually, the file structure:
# <div className="min-h-screen bg-[var(--hp-bg)] flex flex-col">
#   <Navbar />
#   <div className="flex-1 pt-24 pb-20">
#     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
#       ... Breadcrumbs ...
#       <div className="grid ..."> ... </div>
#     </div>
#   </div>
# </div>

pattern_grid_end = r'(</div>\s*</div>\s*</div>\s*<div className="max-w-7xl)'
# Wait, this is getting very hacky. Let's do it safely.
