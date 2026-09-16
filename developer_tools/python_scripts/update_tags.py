path = "src/app/hardware/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Category Tag
old_category_tag = """                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full">
                    {item.category}
                  </span>
                </div>"""
new_category_tag = """                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>"""
content = content.replace(old_category_tag, new_category_tag)

# Difficulty Tag
old_difficulty_tag = """                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-semibold backdrop-blur-md border rounded-full ${
                    item.difficulty === 'Beginner' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                    item.difficulty === 'Intermediate' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                    'bg-red-500/20 border-red-500/30 text-red-400'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>"""
new_difficulty_tag = """                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold backdrop-blur-md border rounded-full shadow-sm ${
                    item.difficulty === 'Beginner' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                    item.difficulty === 'Intermediate' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                    'bg-red-500/20 border-red-500/30 text-red-400'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>"""
content = content.replace(old_difficulty_tag, new_difficulty_tag)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated tags to be smaller.")
