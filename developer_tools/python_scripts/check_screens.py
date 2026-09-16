path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
live_screen = re.search(r'if \(active\) \{[\s\S]*?return \([\s\S]*?className="min-h-screen[\s\S]*?(?=return \(\n\s*<div className="min-h-screen)', content)
if live_screen:
    print(live_screen.group(0)[:1500])
else:
    print("Live screen not found")
