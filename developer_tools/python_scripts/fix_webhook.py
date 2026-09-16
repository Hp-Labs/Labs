path = "src/app/api/premium/webhook/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || \"whsec_test_secret_12345\";", 
"const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET;\nif (!WEBHOOK_SECRET) console.warn('PAYMENT_WEBHOOK_SECRET is missing!');")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed webhook fallback.")
