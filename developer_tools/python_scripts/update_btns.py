import re

path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# India button
content = re.sub(
    r'<a[^>]*href=\{item\.links\.india\}[^>]*>.*?Available in India.*?</a>',
    r'''<a 
                        href={item.links.india} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 text-sm font-bold text-white transition-all transform hover:scale-[1.02]"
                      >
                        <MapPin className="w-4 h-4 text-white/90" />
                        India
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-white/70" />
                      </a>''',
    content,
    flags=re.DOTALL
)

# Global button
content = re.sub(
    r'<a[^>]*href=\{item\.links\.global\}[^>]*>.*?Global Shipping.*?</a>',
    r'''<a 
                        href={item.links.global} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 text-sm font-bold text-white transition-all transform hover:scale-[1.02]"
                      >
                        <Globe className="w-4 h-4 text-white/90" />
                        Global
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-white/70" />
                      </a>''',
    content,
    flags=re.DOTALL
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated hardware buttons.")
