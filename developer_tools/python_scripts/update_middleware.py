import os
import re

with open('src/middleware.ts', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = '''
  // SEC-12: Basic protection for admin UI routes (BYPASSED)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Auth disabled temporarily
    // const session = request.cookies.get('hplabs_session_id');
    // if (!session) {
    //  return NextResponse.redirect(new URL('/login', request.url));
    // }
  }
'''

c = re.sub(r'// SEC-12: Basic protection for admin UI routes.*?return NextResponse\.redirect\(new URL\(\'/login\', request\.url\)\);\s*\}\s*\}', replacement.strip(), c, flags=re.DOTALL)

with open('src/middleware.ts', 'w', encoding='utf-8') as f:
    f.write(c)

