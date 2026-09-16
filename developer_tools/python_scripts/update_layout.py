path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Move fullDescription inside details
# Current structure:
#                 <p className="text-[var(--hp-text-muted)] text-sm leading-relaxed mb-6 flex-1">
#                   {item.fullDescription}
#                 </p>
# 
#                 {/* Features & Use Cases Grid */}
#                 
#                 <details className="group/details mb-4">
# ...
#                   <div className="flex flex-col gap-4 mt-4 mb-2">

full_desc_block = """                <p className="text-[var(--hp-text-muted)] text-sm leading-relaxed mb-6 flex-1">
                  {item.fullDescription}
                </p>"""

if full_desc_block in content:
    content = content.replace(full_desc_block, "")
    
    # Inject it inside the details div
    details_div = '<div className="flex flex-col gap-4 mt-4 mb-2">'
    new_details_div = details_div + '\n\n                    <p className="text-[var(--hp-text)] text-sm leading-relaxed bg-[var(--hp-bg-surface)] p-3 rounded-lg border border-[var(--hp-border)]">\n                      {item.fullDescription}\n                    </p>'
    content = content.replace(details_div, new_details_div)
else:
    print("Could not find fullDescription block.")


# 2. Update the Buy buttons
old_india_btn = """                      <a 
                        href={item.links.india} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--hp-bg)] hover:bg-[var(--hp-bg-surface)] border border-[var(--hp-border)] hover:border-[var(--hp-border-hover)] text-sm font-medium text-white transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-[var(--hp-primary)]" />
                        Available in India
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-gray-400" />
                      </a>"""

new_india_btn = """                      <a 
                        href={item.links.india} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 text-sm font-bold text-white transition-all transform hover:scale-[1.02]"
                      >
                        <MapPin className="w-4 h-4 text-white/90" />
                        India
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-white/70" />
                      </a>"""

old_global_btn = """                      <a 
                        href={item.links.global} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--hp-bg)] hover:bg-[var(--hp-bg-surface)] border border-[var(--hp-border)] hover:border-[var(--hp-border-hover)] text-sm font-medium text-white transition-colors"
                      >
                        <Globe className="w-4 h-4 text-blue-400" />
                        Global Shipping
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-gray-400" />
                      </a>"""

new_global_btn = """                      <a 
                        href={item.links.global} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 text-sm font-bold text-white transition-all transform hover:scale-[1.02]"
                      >
                        <Globe className="w-4 h-4 text-white/90" />
                        Global
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-white/70" />
                      </a>"""

if old_india_btn in content:
    content = content.replace(old_india_btn, new_india_btn)
else:
    print("Could not find India button.")

if old_global_btn in content:
    content = content.replace(old_global_btn, new_global_btn)
else:
    print("Could not find Global button.")


with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated hardware layout.")
