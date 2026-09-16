# Check the SecurePoCUploader signature to see if onSuccess takes 0 args
path = "src/components/SecurePoCUploader.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
# Find the interface
match = re.search(r"interface SecurePoCUploaderProps \{[\s\S]*?\}", content)
if match:
    print(match.group(0).encode("ascii","replace").decode())
