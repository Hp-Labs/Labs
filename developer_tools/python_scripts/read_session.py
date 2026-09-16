path = "src/lib/services/labSessionStore.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()
    print(content.encode("ascii", "ignore").decode())
