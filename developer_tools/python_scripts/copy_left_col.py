path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
normal_match = re.search(r'(\{\/\*  LEFT: Lab Content  \*\/\}[\s\S]*?)<div className="space-y-6">\s*\{\/\* Right Panel \*\/\}', content)

if not normal_match:
    # Try finding the right column start
    normal_match = re.search(r'(\{\/\*  LEFT: Lab Content  \*\/\}[\s\S]*?)<div className="lg:col-span-1 space-y-6">', content)

if normal_match:
    left_col = normal_match.group(1)
    # Now find the LiveEngagementScreen left column
    live_match = re.search(r'(<div className="lg:col-span-2 space-y-6">[\s\S]*?<!-- Right Column - Target & Actions -->)', content)
    if live_match:
        pass
    else:
        # maybe it is {/* Right Column - Target & Actions */}
        live_match = re.search(r'(<div className="lg:col-span-2 space-y-6">[\s\S]*?\{\/\* Right Column - Target & Actions \*\/})', content)
        if live_match:
            print("Found live left column! Replacing...")
            content = content.replace(live_match.group(1), left_col + "\n              " + "{/* Right Column - Target & Actions */}")
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
        else:
            print("Live left column not found")
else:
    print("Normal left column not found")
