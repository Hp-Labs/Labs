path = "src/components/SecurePoCUploader.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
# Get export and onSuccess prop
import re
print(content[:300].encode("ascii","replace").decode())
print("---")
print("onSuccess in file:", "onSuccess" in content)
print("default export:", "export default" in content)
