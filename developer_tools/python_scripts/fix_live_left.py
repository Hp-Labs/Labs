path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# The normal left column starts at {/*  LEFT: Lab Content  */}
start_left = content.find("{/*  LEFT: Lab Content  */}")
if start_left == -1: print("start_left not found"); exit(1)

# It ends at `</div>\n      </div>\n\n      </div>\n    </div>\n  );\n}`
end_left = content.rfind("</div>\n      </div>\n\n      </div>\n    </div>\n  );\n}")
if end_left == -1:
    # Try finding just the end of the return statement
    end_left = content.rfind("</div>\n    </div>\n  );\n}")
    if end_left == -1: print("end_left not found"); exit(1)

normal_left = content[start_left:end_left]
# Strip trailing divs until we just have the column. 
# Look for the last `</div>` before the end_left.
normal_left = normal_left[:normal_left.rfind('</div>\n      </div>')]

# The live left column starts at `{/* Left Column - Briefing */}`
live_left_start = content.find("{/* Left Column - Briefing */}")
if live_left_start == -1: print("live_left_start not found"); exit(1)

# It ends at `{/* Right Column - Target & Actions */}`
live_left_end = content.find("{/* Right Column - Target & Actions */}")
if live_left_end == -1: print("live_left_end not found"); exit(1)

live_left = content[live_left_start:live_left_end]

# Replace the live left column with the normal left column!
# But normal left column starts with `<div className="space-y-6">`
# and live left column needs `<div className="lg:col-span-2 space-y-6">`
new_live_left = normal_left.replace('<div className="space-y-6">', '<div className="lg:col-span-2 space-y-6">', 1)

content = content[:live_left_start] + new_live_left + "\n              " + content[live_left_end:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced Live left column with Normal left column!")
