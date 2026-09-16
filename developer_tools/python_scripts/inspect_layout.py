path = "src/app/layout.tsx"
import os
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        print(f.read())
else:
    print("layout.tsx not found")
