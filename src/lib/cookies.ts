// src/lib/cookies.ts
import { NextResponse } from 'next/server'

export function setAuthCookie(
  response: NextResponse,
  value: string,
  role: string | null,
  maxAge: number = 60 * 60 // 1hr
) {
  // Set or remove the login cookie
  response.cookies.set('admin-login', value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: value ? maxAge : 0,
  })
  // Set or remove the role cookie
  response.cookies.set('role', role || '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: role ? maxAge : 0,
  })
}
