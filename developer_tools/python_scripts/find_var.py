import os
for root, dirs, files in os.walk("src/lib/data"):
    for f in files:
        if not f.endswith(".ts"): continue
        p = os.path.join(root, f)
        with open(p, "r", encoding="utf-8") as fp:
            if "WEB_INFORMATION_LABS" in fp.read():
                print(f"Found in {p}")
