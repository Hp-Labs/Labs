path = "src/lib/services/subscriptionStore.ts"
if __import__("os").path.exists(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        print(f.read())
else:
    print("No subscriptionStore")
