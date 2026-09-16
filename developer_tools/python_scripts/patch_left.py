path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Find normal left column
# It starts with {/*  LEFT: Lab Content  */}
# And goes until the end of the file basically, just before the closing divs.
normal_left_match = re.search(r'(\{\/\*  LEFT: Lab Content  \*\/\}[\s\S]*?</div>\n          </div>\n\s*</div>\n\s*</div>)', content)

if normal_left_match:
    normal_left = normal_left_match.group(1)
    
    # Strip the last few closing divs of the page to just get the column itself
    # Actually, the normal screen only HAS a left column, no right column! 
    # Because `<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mt-6 opacity-10 blur-xl pointer-events-none select-none">`
    # Then `LEFT: Lab Content` which is `<div className="space-y-6">`
    
    # Let's extract the exact `space-y-6` div for the left content.
    match = re.search(r'(\{\/\*  LEFT: Lab Content  \*\/.*?)\n\s*</div>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*\);\n\}', content, re.DOTALL)
    if match:
        left_col_content = match.group(1)
        
        # Now find the Live Screen's left column
        # It starts with `{/* Left Column - Briefing */}`
        live_left_match = re.search(r'(\{\/\* Left Column - Briefing \*\/\}[\s\S]*?)\{\/\* Right Column - Target & Actions \*\/\}', content)
        if live_left_match:
            print("Found live left column. Replacing!")
            new_live_left = "{/* Left Column - Briefing */}\n" + left_col_content + "\n              "
            # But wait, `left_col_content` is `lg:col-span-1` or something?
            # Let's make sure it has `lg:col-span-2 space-y-6`
            new_live_left = new_live_left.replace('<div className="space-y-6">', '<div className="lg:col-span-2 space-y-6">')
            
            content = content.replace(live_left_match.group(1), new_live_left + "\n              ")
            
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print("Successfully patched live left column.")
        else:
            print("Live left column not found")
    else:
        print("Could not isolate exact left col")
else:
    print("Normal left not found")
