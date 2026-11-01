import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_PATH_PATTERNS = [
  /\.env(\..+)?$/i,
  /\.git(\/.*)?$/i,
  /\.aws(\/.*)?$/i,
  /\.ssh(\/.*)?$/i,
  /\.php(\/.*)?$/i,
  /\.js\.map$/i,
  /\.css\.map$/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/xmlrpc\.php/i,
  /\/phpmyadmin/i,
  /\/cgi-bin/i,
  /\/actuator/i,
  /\/eval-stdin/i,
  /\/vendor\/phpunit/i,
];

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  if (!ALLOWED_METHODS.has(method)) {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  const rawUrl = request.url;
  if (rawUrl.includes('..') || rawUrl.includes('%2e%2e') || rawUrl.includes('%2E%2E') || rawUrl.includes('%00')) {
    return new NextResponse('Forbidden: Invalid Path Traversal', { status: 403 });
  }

  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Forbidden: Access Denied', { status: 403 });
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/).*)'],
};
