import os
for root, dirs, files in os.walk("src/app/api"):
    for f in files:
        if f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                c = file.read()
                if "userId" in c and "await req.json()" in c:
                    print(f"Possible IDOR in {path}")
