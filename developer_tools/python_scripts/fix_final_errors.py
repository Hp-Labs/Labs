path = "src/app/api/partner/activate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

import re
c = re.sub(r"if \(!sessionToken \|\| !userId\) \{", "if (!sessionToken) {", c)
c = c.replace("premiumUntil: premiumUntilISO,", "premiumUntil: premiumUntilMs,")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed.")
