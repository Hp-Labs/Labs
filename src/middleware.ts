import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SECRET_PATH = '/hplabs';
const ADMIN_LOGIN_PATH = '/hackerplus/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Decoy: anyone hitting /admin* gets a plain 404
  if (pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 });
  }

  // Protect the hackerplus/login URL - only accessible if they came through the secret gateway
  if (pathname.startsWith(ADMIN_LOGIN_PATH)) {
    const gateway = request.cookies.get('gateway_unlocked');
    if (!gateway) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Protect secret admin routes (except the login page itself)
  if (pathname.startsWith(ADMIN_SECRET_PATH) && !pathname.startsWith(ADMIN_LOGIN_PATH)) {
    const session = request.cookies.get('hplabs_session_id');
    if (!session) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // SEC-15: CSRF protection for mutating API routes
  if (
    pathname.startsWith('/api/') &&
    ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)
  ) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          if (!pathname.startsWith('/api/hpvuln/ingest')) {
            return new NextResponse('CSRF Check Failed', { status: 403 });
          }
        }
      } catch (e) {
        return new NextResponse('Invalid Origin', { status: 400 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/hplabs/:path*', '/hackerplus/:path*', '/api/:path*'],
};
