path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Revert my bad main tag
content = content.replace("      </main>\n\n    </div>\n  );\n}", "    </div>\n  );\n}")

# The LabPage component ends right before function MetaItem
idx = content.find("function MetaItem")
if idx != -1:
    before = content[:idx]
    after = content[idx:]
    
    # We want to replace the LAST `</div>` in `before`
    last_div = before.rfind("</div>")
    if last_div != -1:
        before = before[:last_div] + "      </main>\n    </div>" + before[last_div+6:]
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(before + after)
print("Fixed JSX closing tag")
