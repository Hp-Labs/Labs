path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Extract Right Panel (Target Config & Uploader)
right_panel_match = re.search(r'(\{\/\* Right Column - Target & Actions \*\/\}[\s\S]*?</div>\n                 </div>)', content)
if not right_panel_match:
    print("Could not find right panel")
    exit(1)
right_panel = right_panel_match.group(1)

# Extract Left Panel (Methodology Tabs)
# It starts at `{/*  LEFT: Lab Content  */}` and ends just before `</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}`
left_panel_match = re.search(r'(\{\/\*  LEFT: Lab Content  \*\/\}[\s\S]*?\n)\s*</div>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*\);\n\}', content)
if not left_panel_match:
    print("Could not find left panel")
    exit(1)
left_panel = left_panel_match.group(1).replace('<div className="space-y-6">', '<div className="xl:col-span-2 space-y-6">')

# Extract Live Header
live_header_match = re.search(r'(\{\/\* Header \*\/\}[\s\S]*?</div>\n           </div>)', content)
live_header = live_header_match.group(1)

# Extract Normal Header (Breadcrumb)
normal_header_match = re.search(r'(\{\/\* Breadcrumb \*\/\}[\s\S]*?</div>)', content)
normal_header = normal_header_match.group(1)

# Construct new return block
new_return = f"""
  return (
    <div className="min-h-screen bg-[var(--hp-bg)]" suppressHydrationWarning>
      <Navbar />
      <div className="pt-24 pb-24 px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {{active ? (
          {live_header}
        ) : (
          {normal_header}
        )}}

        <div className="relative w-full h-full min-h-[500px]">
          {{!active && !failed && !showSuccess && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl mt-6">
              <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-[var(--hp-primary)]/50 rounded-3xl shadow-[0_0_50px_rgba(191,95,255,0.3)] max-w-sm w-full transform transition-all hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-[var(--hp-primary)]/20 flex items-center justify-center mx-auto mb-6 border border-[var(--hp-primary)]/30">
                  <Play size={{40}} className="text-[var(--hp-primary)] ml-2" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Deploy Target</h2>
                <p className="text-sm text-gray-400 mb-8">Launch a dedicated instance for this vulnerability. Timer begins immediately upon deployment.</p>
                <button
                  onClick={{handleActivate}}
                  disabled={{activating}}
                  className="w-full py-4 rounded-xl btn-primary font-bold shadow-[0_0_30px_var(--hp-primary)] hover:shadow-[0_0_50px_var(--hp-primary)] flex items-center justify-center gap-2 text-lg"
                >
                  {{activating ? <RefreshCw size={{24}} className="animate-spin" /> : <Play size={{24}} />}}
                  Activate Lab
                </button>
              </div>
            </div>
          )}}

          {{showSuccess && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#050508]/80 backdrop-blur-md">
               <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-green-500/50 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.3)] max-w-md w-full">
                 <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle size={{50}} className="text-green-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Target Compromised!</h2>
                 <p className="text-gray-400 text-sm mb-6">Lab completed successfully. You can safely exit.</p>
                 <button onClick={{() => {{ setShowSuccess(false); setActive(false); }}}} className="px-6 py-2 rounded-xl bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 transition-colors">Close</button>
               </div>
            </div>
          )}}

          {{failed && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#050508]/80 backdrop-blur-md">
               <div className="text-center p-10 bg-[var(--hp-card-bg)] border border-red-500/50 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.3)] max-w-md w-full">
                 <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle size={{50}} className="text-red-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Engagement Failed</h2>
                 <p className="text-gray-400 text-sm mb-6">Time expired before PoC was verified. System locked.</p>
                 <button onClick={{() => {{ setFailed(false); setActive(false); }}}} className="px-6 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 transition-colors">Acknowledge</button>
               </div>
            </div>
          )}}

          <div className={{`grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 mt-6 ${{!active || showSuccess || failed ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}}`}}>
             {left_panel}

             {{active && (
               {right_panel}
             )}}
          </div>
        </div>
      </div>
    </div>
  );
}}
"""

# Replace everything from `if (active) {` down to the end of the file with `new_return`
content = re.sub(r'  if \(active\) \{[\s\S]*$', new_return, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced entire return structure!")
