import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/cookies'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  await connectToDB()
  const { username, password } = await request.json()

  // Find user by username
  const user = await AdminUser.findOne({ username })
  
  // Optionally check .env admin (still plaintext check)
  if (
    process.env.ADMIN_PASSWORD &&
    username === 'dev' &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({ ok: true, role: 'admin' })
    setAuthCookie(response, 'authenticated', 'superadmin', 60 * 60)
    return response
  }

  // If user exists, compare password using bcrypt
  if (user && (await bcrypt.compare(password, user.password))) {
    // Return username and avatarUrl in the response
    const response = NextResponse.json({
      ok: true,
      role: user.role,
      username: user.username,
      avatarUrl: user.avatarUrl || '', // fallback if not set
    })
    setAuthCookie(response, 'authenticated', user.role, 60 * 60)
    return response
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}

