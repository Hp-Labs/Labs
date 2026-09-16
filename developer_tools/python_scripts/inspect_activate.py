path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
activate_fn = re.search(r'const handleActivate = [\s\S]*?\}', content)
if activate_fn:
    print(activate_fn.group(0))

timer_effect = re.search(r'useEffect\(\(\) => \{[\s\S]*?timeLeft[\s\S]*?\}, \[', content)
if timer_effect:
    print("\n", timer_effect.group(0))
