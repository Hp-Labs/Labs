path = "src/app/api/premium/webhook/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("const expectedSignature = crypto.createHmac(\"sha256\", WEBHOOK_SECRET).update(rawBody).digest(\"hex\");", 
"if (!WEBHOOK_SECRET) return NextResponse.json({ error: \"Server configuration error\" }, { status: 500 });\n    const expectedSignature = crypto.createHmac(\"sha256\", WEBHOOK_SECRET).update(rawBody).digest(\"hex\");")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed webhook secret crash.")
