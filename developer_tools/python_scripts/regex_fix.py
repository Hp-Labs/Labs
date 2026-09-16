import re

path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to find the exact early return block
pattern = r'(if \(!unlocked\) \{\s*const userXP = user\?\.xp \?\? 0;\s*return \([\s\S]*?Return to Domain Overview\s*</Link>\s*</div>\s*</div>\s*\);\s*\})'

match = re.search(pattern, content)
if match:
    locked_block = match.group(1)
    # Remove from top
    content = content.replace(locked_block, "")
    
    # Append right above the main return (
    main_return_pattern = r'(\n\s*return \(\s*<div className="min-h-screen)'
    content = re.sub(main_return_pattern, r'\n\n  ' + locked_block.replace('\\', '\\\\') + r'\1', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully moved via Regex!")
else:
    print("Could not match the block.")
