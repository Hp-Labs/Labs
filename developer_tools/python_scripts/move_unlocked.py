path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Extract the `if (!unlocked) { ... }` block
# It starts with `  // If locked, render strict Access Denied screen\n    if (!unlocked) {`
# and ends just before `  const handleActivate`
unlocked_block_match = re.search(r'(  // If locked, render strict Access Denied screen\n\s*if \(!unlocked\) \{[\s\S]*?</div>\n\s*</div>\n\s*\);\n\s*\})', content)
if not unlocked_block_match:
    print("Could not find if (!unlocked) block")
    exit(1)
locked_block = unlocked_block_match.group(1)
print(f"Found locked block ({len(locked_block)} chars)")

# Remove it from current position
content = content.replace(locked_block, "")

# Find the useEffect block
effect_start = content.find("  // Restore active session if the user navigates back")
if effect_start == -1:
    print("useEffect not found!")
    exit(1)

# Find the end of the useEffect (ends with `  }, [userId, lab?.id]);\n`)
effect_end_match = re.search(r'  \}, \[userId, lab\?\.id\]\);\n', content[effect_start:])
if not effect_end_match:
    print("useEffect end not found!")
    exit(1)

effect_end = effect_start + effect_end_match.end()

# Insert the locked block RIGHT AFTER the useEffect
content = content[:effect_end] + "\n" + locked_block + "\n" + content[effect_end:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Moved if (!unlocked) BELOW useEffect — hook order fixed!")
