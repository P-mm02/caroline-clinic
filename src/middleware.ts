import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public (unprotected) admin paths
const PUBLIC_PATHS = ['/admin/login', '/admin/login/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run on /admin or subpaths, except /admin/login
  if (pathname.startsWith('/admin') && !PUBLIC_PATHS.includes(pathname)) {
    const isAuth = request.cookies.get('admin-login')?.value === 'authenticated'
    if (!isAuth) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
  }
  return NextResponse.next()
}

// Matcher is REQUIRED in src/middleware.ts
export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
