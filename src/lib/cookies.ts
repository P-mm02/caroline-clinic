// src/lib/cookies.ts
import { NextResponse } from 'next/server'

// src/lib/cookies.ts
export function setAuthCookie(
  response: NextResponse,
  value: string,
  role: string | null,
  maxAge: number = 60 * 60 // 1hr
) {
  if (value) {
    response.cookies.set('admin-login', value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    })
  } else {
    response.cookies.delete('admin-login')
  }
  if (role) {
    response.cookies.set('role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    })
  } else {
    response.cookies.delete('role')
  }
}

