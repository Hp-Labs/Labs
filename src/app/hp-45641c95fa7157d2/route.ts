import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL('/hackerplus/login', request.url);
  const response = NextResponse.redirect(url);
  
  response.cookies.set('gateway_unlocked', 'true', {
    path: '/',
    maxAge: 300,
    httpOnly: true,
    sameSite: 'lax',
  });
  
  return response;
}
