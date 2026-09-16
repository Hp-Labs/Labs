for p in ["src/app/api/auth/register-otp/verify/route.ts", "src/app/api/partner/verify-otp/route.ts"]:
    with open(p, "r", encoding="utf-8") as f:
        c = f.read()
        if "000000" in c or "123456" in c or "bypass" in c.lower():
            print(f"Bypass found in {p}")
        else:
            print(f"No bypass in {p}")
