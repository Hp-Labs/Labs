# Fix partner activate
path = "src/app/api/partner/activate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("if (!sessionToken || !userId) {", "if (!sessionToken) {")
c = c.replace("`[PartnerActivation] userId=${verifiedUserId} email=${session.email} months=${months}/${cap} premiumUntil=${premiumUntilISO}`", "`[PartnerActivation] userId=${verifiedUserId} email=${session.email} months=${months}/${cap} premiumUntil=${premiumUntilISO}`")

# Wait, the other error was:
# src/app/api/partner/activate/route.ts(103,34): error TS2322: Type 'string' is not assignable to type 'number'.
# Let's check what line 103 is.
