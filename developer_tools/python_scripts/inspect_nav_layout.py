path = "src/components/Navbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Get the flex container for the main nav links
match = re.search(r'<div className="hidden lg:flex items-center[^>]*>', content)
if match:
    print("Nav Links Container:", match.group(0))

# Get the flex container for the right side (where Upgrade is)
match2 = re.search(r'<div className="flex items-center justify-end[^>]*>', content)
if match2:
    print("Right Side Container:", match2.group(0))

# Also search for 'href="/pricing"' to see where we placed the Pricing link for logged out users
match3 = re.search(r'.{0,50}href="/pricing".{0,50}', content)
if match3:
    print("Pricing Link:", match3.group(0))
