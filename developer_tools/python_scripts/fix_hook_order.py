import re

path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# The exact block to capture
pattern = r'(  // If locked, render strict Access Denied screen\n\s*if \(!unlocked\) \{[\s\S]*?Return to Domain Overview\n\s*</Link>\n\s*</div>\n\s*</div>\n\s*\);\n\s*\})'

match = re.search(pattern, content)
if match:
    locked_block = match.group(1)
    
    # Remove it from current location
    content = content.replace(locked_block, "")
    
    # Place it before the main return
    main_return_pattern = r'(\s*return \(\n\s*<div className="min-h-screen bg-\[var\(--hp-bg\)\] flex flex-col">)'
    
    content = re.sub(main_return_pattern, r'\n\n' + locked_block.replace('\\', '\\\\') + r'\1', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully moved the early return block!")
else:
    print("Could not match the locked block!")
