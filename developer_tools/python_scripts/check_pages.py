import os

paths = ["src/app/leaderboard/page.tsx", "src/app/profile/page.tsx"]
for path in paths:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            print(f"--- {path} ---")
            print("Footer exists?" , "</footer>" in content)
            print("Length:", len(content))
    else:
        print(f"Not found: {path}")
