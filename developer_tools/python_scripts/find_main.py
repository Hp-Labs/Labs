path = "src/app/dashboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = list(re.finditer(r'</main>', content))
if matches:
    idx = matches[-1].start()
    print(content[idx-100:idx+100])
else:
    print("No main tags found")
