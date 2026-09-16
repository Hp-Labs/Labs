import os

path = r"src/middleware.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace the bypass with actual check
old_mid = """  // SEC-12: Basic protection for admin UI routes (BYPASSED)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Auth disabled temporarily
    // const session = request.cookies.get('hplabs_session_id');
    // if (!session) {
    //  return NextResponse.redirect(new URL('/login', request.url));
    // }
  }"""

new_mid = """  // SEC-12: Basic protection for admin UI routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('hplabs_session_id');
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }"""

c = c.replace(old_mid, new_mid)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed middleware admin bypass.")
