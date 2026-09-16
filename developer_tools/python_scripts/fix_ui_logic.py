path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. FIX LiveEngagementScreen
# We want to remove the Deploy Target overlay from LiveEngagementScreen.
# Replace the old `{!active && !failed && !showSuccess && (...) }` block with nothing.
deploy_target_pattern = r'\{!active && !failed && !showSuccess && \([\s\S]*?Activate Lab\n\s*</button>\n\s*</div>\n\s*</div>\n\s*\)\}'
content = re.sub(deploy_target_pattern, '', content)

# 2. Fix LiveEngagementScreen grid blur
# Old: className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${!active ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}
# New: className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${(showSuccess || failed) ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}
content = content.replace("className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${!active ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}", "className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${(showSuccess || failed) ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}`}")


# 3. FIX NormalPreLabScreen
# We need to wrap `<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mt-6">`
# with the Deploy Target overlay and the blur.
normal_grid_pattern = r'<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mt-6">'
normal_replacement = """<div className="relative w-full h-full min-h-[500px]">
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mt-6 opacity-10 blur-xl pointer-events-none select-none">"""
content = content.replace(normal_grid_pattern, normal_replacement)

# Since we opened `<div className="relative...">`, we need to close it.
# The `NormalPreLabScreen` ends with `</div>\n    </div>\n  );\n}`
# We need to add one more closing `</div>` right before the last `</div>\n    </div>\n  );\n}`
# But to be safe, let's just find the very end of the component.
end_pattern = r'(      </div>\n    </div>\n  \);\n\})'
content = re.sub(end_pattern, r'      </div>\n\n      </div>\n    </div>\n  );\n}', content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed screens rendering!")
