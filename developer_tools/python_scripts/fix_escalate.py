import os

path = r"src/app/api/support/escalate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

old_fallback = """    // Fallback for guest-bypass
    if (!serverUser && userId === "HP-00000000") {
       serverUser = { id: "HP-00000000", username: "hacker_guest", email: "guest@hplabs.io", phone: "0000000000", isPremium: false };
    }"""

new_fallback = """    if (!serverUser) {
        return NextResponse.json({ success: false, message: "Unauthorized. Please log in." }, { status: 401 });
    }"""

c = c.replace(old_fallback, new_fallback)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed escalate auth")
