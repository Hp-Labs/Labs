path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_left = content.find("LEFT: Lab Content")
start_left = content.rfind("{", 0, start_left) # Go back to the `{`

end_left = content.rfind("</div>\n    </div>\n  );\n}")
normal_left = content[start_left:end_left]
normal_left = normal_left[:normal_left.rfind('</div>\n      </div>')]

live_left_start = content.find("Left Column - Briefing")
live_left_start = content.rfind("{", 0, live_left_start)

live_left_end = content.find("Right Column - Target & Actions")
live_left_end = content.rfind("{", 0, live_left_end)

new_live_left = normal_left.replace('<div className="space-y-6">', '<div className="lg:col-span-2 space-y-6">', 1)

content = content[:live_left_start] + new_live_left + "\n              " + content[live_left_end:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Successfully replaced Live left column!")
