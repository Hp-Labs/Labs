path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    if "Hardware" in f.read():
        print("Hardware exists in page.tsx")
    else:
        print("Hardware NOT found in page.tsx")
