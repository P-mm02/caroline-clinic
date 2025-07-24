import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/cookies'

const USERS = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'staff', password: 'staff', role: 'staff' },
  { username: 'operator', password: 'operator', role: 'operator' },
]

export async function POST(request: Request) {
  const { username, password } = await request.json()
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  )
  if (user) {
    const response = NextResponse.json({ ok: true, role: user.role })
    setAuthCookie(response, 'authenticated', user.role, 60 * 60)
    return response
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
