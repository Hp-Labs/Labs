import re

path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Move shortDescription inside the details block
short_desc_pattern = r'(<p className="text-\[var\(--hp-primary\)\] text-sm font-medium mb-4">\{item\.shortDescription\}</p>)'
match = re.search(short_desc_pattern, content)
if match:
    short_desc = match.group(1)
    content = content.replace(short_desc + "\n", "")
    content = content.replace(short_desc, "") # just in case
    
    details_start = '<div className="flex flex-col gap-4 mt-4 mb-2">'
    new_details_start = details_start + '\n\n                    ' + short_desc
    content = content.replace(details_start, new_details_start)

# 2. Update India (Red) and Global (Blue) Buttons
india_pattern = r'<a \s*href=\{item\.links\.india\}.*?Available in India.*?</a>|<a \s*href=\{item\.links\.india\}[^>]*>.*?India.*?</a>'
blue_pattern = r'<a \s*href=\{item\.links\.global\}[^>]*>.*?Global.*?</a>'

india_glossy = """<a 
                          href={item.links.india} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative group overflow-hidden flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-b from-red-400 to-rose-600 hover:from-red-300 hover:to-rose-500 shadow-[0_4px_15px_rgba(244,63,94,0.4)] border-t border-white/40 text-sm font-bold text-white transition-all transform hover:-translate-y-0.5"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                          <MapPin className="w-4 h-4 text-white drop-shadow-md relative z-10" />
                          <span className="relative z-10 drop-shadow-md tracking-wide">INDIA</span>
                        </a>"""

global_glossy = """<a 
                          href={item.links.global} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative group overflow-hidden flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-b from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-[0_4px_15px_rgba(59,130,246,0.4)] border-t border-white/40 text-sm font-bold text-white transition-all transform hover:-translate-y-0.5"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                          <Globe className="w-4 h-4 text-white drop-shadow-md relative z-10" />
                          <span className="relative z-10 drop-shadow-md tracking-wide">GLOBAL</span>
                        </a>"""

content = re.sub(india_pattern, india_glossy, content, flags=re.DOTALL)
content = re.sub(blue_pattern, global_glossy, content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated hardware card UI (moved description, glossy red/blue buttons without arrows).")
