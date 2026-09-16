path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# I will replace the ENTIRE return statement inside LabPage
# The signature is:
# export default function LabPage({ params }: { params: { domain: DomainId; severity: Severity; level: string } }) {

# I'll find `return (` inside LabPage, up to the end of the component.
idx1 = content.find("return (\n    <div className=\"bg-[var(--hp-bg)]")
idx2 = content.find("function MetaItem")

if idx1 != -1 and idx2 != -1:
    body = content[idx1:idx2]
    # Let's count divs manually or just use a known good structure.
    # Count opening and closing divs.
    
    open_divs = len(re.findall(r'<div\b', body))
    close_divs = len(re.findall(r'</div>', body))
    print("Open:", open_divs, "Close:", close_divs)
    
    # If open > close, add close at the end
    while open_divs > close_divs:
        body = body.replace("  );\n}\n\n", "    </div>\n  );\n}\n\n", 1)
        close_divs += 1
        
    while close_divs > open_divs:
        body = body.replace("    </div>\n  );\n}\n\n", "  );\n}\n\n", 1)
        close_divs -= 1
        
    content = content[:idx1] + body + content[idx2:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        print("Fixed mismatched divs")
