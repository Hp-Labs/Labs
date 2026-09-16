import os
for root, dirs, files in os.walk("src/app/api"):
    for f in files:
        if f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "0000" in c or "1234" in c or "bypass" in c.lower():
                    print(f"File {path} has suspect strings:")
                    lines = c.split("\n")
                    for i, l in enumerate(lines):
                        if "0000" in l or "1234" in l or "bypass" in l.lower():
                            print(f"  {i+1}: {l.strip()}")
