path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Extract the if (!unlocked) block
match = re.search(r'(  // If locked, render strict Access Denied screen\n\s*if \(!unlocked\) \{[\s\S]*?</div>\n\s*</div>\n\s*\);\n\s*\})', content)
if not match:
    print("Could not find if (!unlocked) block")
    exit(1)
locked_block = match.group(1)

# 2. Remove it from its current position
content = content.replace(locked_block, "")

# 3. Find the main return statement (which is at the bottom, just before `return (`
main_return = content.find("  return (\n    <div className=\"min-h-screen")
if main_return == -1:
    print("Could not find main return")
    exit(1)

# 4. Insert the if (!unlocked) block right before the main return
content = content[:main_return] + locked_block + "\n\n" + content[main_return:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Moved if (!unlocked) to the bottom, below all hooks!")
