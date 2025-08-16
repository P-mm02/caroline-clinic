import { cookies } from 'next/headers'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic' // ✅ avoid caching in dev adapters

async function getCurrentUser() {
  const jar = await cookies()
  const id = jar.get('admin-user-id')?.value
  const uname = jar.get('admin-username')?.value
  await connectToDB()
  if (id) return AdminUser.findById(id)
  if (uname) return AdminUser.findOne({ username: uname })
  return null
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json; charset=utf-8' }, // ✅ explicit
      })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({
          error: 'currentPassword and newPassword are required',
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        }
      )
    }
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      })
    }
    if (newPassword.length < 3) {
      return new Response(
        JSON.stringify({ error: 'New password must be at least 3 characters' }),
        {
          status: 400,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        }
      )
    }

    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) {
      console.log('Current password is incorrect')
      return new Response(
        JSON.stringify({ error: 'Current password is incorrect' }),
        {
          status: 403, // ✅ keep 403
          headers: { 'content-type': 'application/json; charset=utf-8' }, // ✅ explicit
        }
      )
    }

    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()

    return new Response(JSON.stringify({ message: 'Password updated' }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    })
  } catch (err) {
    console.error('change-password error:', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    })
  }
}
