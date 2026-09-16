path = "src/app/layout.tsx"
import os
if os.path.exists(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        print(f.read().encode("ascii", "ignore").decode())
