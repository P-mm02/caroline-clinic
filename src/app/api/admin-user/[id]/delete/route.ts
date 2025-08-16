import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import { Types } from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

// If you ever run this on Edge accidentally, Cloudinary won't work.
// Force Node runtime if needed:
// export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params // ✅ await the params promise

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
