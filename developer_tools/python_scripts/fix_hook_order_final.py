path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find ALL early returns that happen before hooks
# The pattern: `if (!unlocked) { ... }` block that sits between useEffect and useCallback
# Solution: Move this block to AFTER the last hook (useCallback + others)

# Step 1: Extract if (!unlocked) block
unlocked_match = re.search(r'\n\n  // If locked, render strict Access Denied screen\n\s*if \(!unlocked\) \{[\s\S]*?\n  \}\n', content)
if not unlocked_match:
    print("Could not find if (!unlocked) block")
    # Try another pattern
    unlocked_match = re.search(r'\n\s*// If locked[\s\S]*?\n  \}\n\n  const handleActivate', content)
    if unlocked_match:
        print("Found with alternative pattern")
    else:
        exit(1)

locked_block = unlocked_match.group(0)
print(f"Locked block found, length: {len(locked_block)}")

# Step 2: Remove it
content = content.replace(locked_block, "\n")

# Step 3: Find the last useCallback/hook in the file (just before the first `return (`)
# Insert the locked block right before `return (`
main_return_idx = content.find("  return (")
if main_return_idx == -1:
    print("Main return not found!")
    exit(1)

# Insert locked block just before the main return
content = content[:main_return_idx] + locked_block.strip() + "\n\n" + "  " + content[main_return_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Moved if (!unlocked) to just before main return — ALL hooks now called first!")
