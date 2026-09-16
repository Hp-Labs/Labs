for path in ["src/app/leaderboard/page.tsx", "src/app/profile/page.tsx"]:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Just print the last 10 lines
    lines = content.split("\n")
    print(f"\n--- {path} END ---")
    for line in lines[-10:]:
        print(line)
