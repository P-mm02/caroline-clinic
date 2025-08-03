import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/admin/login', '/admin/login/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin pages (as before)
  if (pathname.startsWith('/admin') && !PUBLIC_PATHS.includes(pathname)) {
    const isAuth = request.cookies.get('admin-login')?.value === 'authenticated'
    if (!isAuth) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect admin API endpoints
  if (
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/admin-user')
  ) {
    const isAuth = request.cookies.get('admin-login')?.value === 'authenticated'
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}
