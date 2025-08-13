import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import { Types } from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary config (if not already initialized globally)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = await context // 👈 required!
  const { id } = params

  await connectToDB()

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  const user = await AdminUser.findById(id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId)
    } catch (err) {
      console.warn('⚠️ Failed to delete avatar from Cloudinary:', err)
    }
  }

  await AdminUser.findByIdAndDelete(id)

  return NextResponse.json(
    { message: 'User deleted successfully' },
    { status: 200 }
  )
}
