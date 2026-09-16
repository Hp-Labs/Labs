path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Check if SecurePoCUploader is already imported
if "SecurePoCUploader" in content:
    print("Already imported!")
else:
    print("NOT imported")
    
# Check what imports exist
match = re.search(r"^import.*$", content, re.MULTILINE)
if match:
    print("First import:", match.group(0).encode("ascii","replace").decode())
