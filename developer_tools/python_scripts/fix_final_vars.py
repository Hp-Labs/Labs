path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Fix timeLimitMinutes
content = re.sub(r'lab\??\.timeLimitMinutes', '(lab?.timeLimitMinutes ?? 60)', content)

# Fix labId parameter in fetch
# fetch(`/api/labs/${lab?.id}/activity` ... body: JSON.stringify({ ... labId: lab.id ... })
content = re.sub(r'labId:\s*lab\??\.id', 'labId: lab?.id || ""', content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Final variables patched")
