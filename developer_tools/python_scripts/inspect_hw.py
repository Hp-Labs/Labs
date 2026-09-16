path = "src/app/hardware/page.tsx"
import os
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        print(f.read()[:500])
else:
    print("hardware/page.tsx not found")
