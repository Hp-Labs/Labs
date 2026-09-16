import os
for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    if "hpvuln" in f.read().lower():
                        print(f"HPVuln found in {path}")
            except:
                pass
