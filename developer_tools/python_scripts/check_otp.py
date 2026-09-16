import os
for root, dirs, files in os.walk("src/app/api"):
    for f in files:
        if f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "123456" in c or "bypass" in c.lower() or "000000" in c:
                    print(f"Suspicious file: {path}")
