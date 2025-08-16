import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/cookies'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import bcrypt from 'bcryptjs'

const ONE_HOUR = 60 * 60

export async function POST(request: Request) {
  await connectToDB()
  const { username, password } = await request.json()

  // Find user by username
  const user = await AdminUser.findOne({ username })

  // .env dev bypass (plaintext)
  if (
    process.env.ADMIN_PASSWORD &&
    username === 'dev' &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const role = 'superadmin' // keep consistent with cookie
    const response = NextResponse.json({
      ok: true,
      role,
      username: 'dev',
      avatarUrl: '', // optional
    })

    // existing auth/role cookies
    setAuthCookie(response, 'authenticated', role, ONE_HOUR)

    // ✅ identifying cookies for server-side profile lookup
    response.cookies.set('admin-user-id', 'dev-user-id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_HOUR,
    })
    response.cookies.set('admin-username', 'dev', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_HOUR,
    })

    return response
  }

  // DB user branch
  if (user && (await bcrypt.compare(password, user.password))) {
    const role = user.role
    const response = NextResponse.json({
      ok: true,
      role,
      username: user.username,
      avatarUrl: user.avatarUrl || '',
    })

    // existing auth/role cookies
    setAuthCookie(response, 'authenticated', role, ONE_HOUR)

    // ✅ identifying cookies for server-side profile lookup
    response.cookies.set('admin-user-id', String(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_HOUR,
    })
    response.cookies.set('admin-username', user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_HOUR,
    })

    return response
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
