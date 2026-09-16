with open("src/app/labs/[id]/page.tsx", "r", encoding="utf-8") as f:
    c = f.read()
    if "getLabById" in c:
        print("Yes, it supports Red Team labs (getLabById is present)")
    else:
        print("No, it only supports VULNERABILITIES")
