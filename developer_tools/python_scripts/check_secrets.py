import os
import re

for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith(".ts") or f.endswith(".tsx") or f.endswith(".js"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                matches = re.finditer(r'(process\.env\.[A-Z_]+)\s*\|\|\s*["\']([^"\']+)["\']', c)
                for m in matches:
                    print(f"Fallback secret found in {path}: {m.group(0)}")
