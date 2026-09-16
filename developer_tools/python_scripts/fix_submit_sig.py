# handleSubmitFlag expects 0 args (since it was defined as async () => {})
# But we are calling it with `true`. Fix: update handleSubmitFlag to accept an optional isPoC param.
path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Find handleSubmitFlag definition
match = re.search(r"const handleSubmitFlag = (useCallback\()?async \(([^)]*)\)", content)
if match:
    print("Signature:", match.group(0).encode("ascii","replace").decode())

# Fix the signature to accept isPoC
content = re.sub(
    r"const handleSubmitFlag = (useCallback\()?async \(\)",
    lambda m: f"const handleSubmitFlag = {m.group(1) or ''}async (isPoC: boolean = false)",
    content
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed handleSubmitFlag to accept isPoC param!")
