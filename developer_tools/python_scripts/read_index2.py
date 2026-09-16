with open("src/lib/data/redteam/index.ts", "r", encoding="utf-8") as f:
    print(f.read().encode("ascii", "ignore").decode("ascii")[:1500])
