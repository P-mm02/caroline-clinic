import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'

export async function GET() {
  try {
    await connectToDB()
    // Exclude sensitive fields (like password)
    const users = await AdminUser.find({}, '-password')
    return NextResponse.json(users, { status: 200 })
  } catch (err) {
    console.error('❌ Error fetching admin users:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
