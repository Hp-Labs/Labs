path = "src/app/api/premium/webhook/route.ts"
if __import__("os").path.exists(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        print(f.read()[:1000])
else:
    print("No webhook route")
