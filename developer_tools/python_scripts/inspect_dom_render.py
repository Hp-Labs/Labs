path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
dom_render = content.find("className=\"w-full flex items-center justify-between")
if dom_render != -1:
    print(content[dom_render-150:dom_render+500])
