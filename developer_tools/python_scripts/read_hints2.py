with open(r"src/app/api/labs/[id]/hints/route.ts", "r", encoding="utf-8-sig") as f:
    c = f.read().encode("ascii", "ignore").decode("ascii")
    print(c)
