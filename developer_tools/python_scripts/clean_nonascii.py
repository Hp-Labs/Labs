path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Remove all non-ascii characters inside JSX comments
content = re.sub(r'\{\/\*([^\*]*?)\*\/\}', lambda m: '{/*' + re.sub(r'[^\x00-\x7F]+', '', m.group(1)) + '*/}', content)

# And fix the 'Return to Domain' string
content = re.sub(r'[^\x00-\x7F]+ Return to Domain', '← Return to Domain', content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned up comments and arrows!")
