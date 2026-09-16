path = "src/app/dashboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("export default function ")
print(content[idx:idx+200])

# Let's search for "</div>\n    </div>\n  );\n}"
idx2 = content.find("</div>\n    </div>\n  );\n}")
if idx2 != -1:
    print("Found end of Dashboard at", idx2)
else:
    print("Not found end")
