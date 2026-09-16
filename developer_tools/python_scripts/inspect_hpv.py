path = "src/app/api/labs/submit-flag/route.ts"
with open(path, "r", encoding="utf-8") as f:
    if "hpvuln" in f.read().lower():
        print("HPVuln exists in submit-flag")
    else:
        print("HPVuln missing in submit-flag")
