path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
submit = re.search(r'const handleSubmitFlag[\s\S]*?\} catch', content)
if submit:
    print(submit.group(0)[:1500])
else:
    print("Submit not found")
