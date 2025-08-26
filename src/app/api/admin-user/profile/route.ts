// src/app/api/admin-user/profile/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import { extractPublicId as extractFromUrl } from '@/utils/imageHelpers'

// ---- Cloudinary config ----
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// ---- Helpers ----
function bufferToStream(buffer: Buffer) {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

async function uploadAvatarToFolder(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files allowed for avatar')
  }
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const stream = bufferToStream(buffer)

  const res = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const cloudinaryStream = cloudinary.uploader.upload_stream(
      {
        folder: 'admin-user',
        quality: 'auto',
        crop: 'thumb',
        width: 300,
        height: 300,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result as any)
      }
    )
    stream.pipe(cloudinaryStream)
  })

  return res.secure_url
}

async function getCurrentUser() {
  const jar = await cookies()

  const idCookie =
    jar.get('admin-user-id')?.value ||
    jar.get('adminUserId')?.value ||
    jar.get('uid')?.value ||
    null

  const usernameCookie =
    jar.get('admin-username')?.value || jar.get('adminUsername')?.value || null

  await connectToDB()

  if (idCookie) {
    const user = await AdminUser.findById(idCookie)
    return user
  }
  if (usernameCookie) {
    const user = await AdminUser.findOne({ username: usernameCookie })
    return user
  }
  return null
}

// ---- GET /api/admin-user/profile ----
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      _id,
      username,
      email,
      role,
      active,
      avatarUrl,
      createdAt,
      updatedAt,
    } = user.toObject()

    return NextResponse.json({
      id: String(_id),
      username,
      email: email ?? '',
      role,
      active,
      avatarUrl: avatarUrl ?? '',
      createdAt,
      updatedAt,
    })
  } catch (err) {
    console.error('GET profile error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ---- PUT /api/admin-user/profile ----
// Update username, email, avatar (multipart/form-data)
// OPTION B: delete old Cloudinary asset first, then upload new one
export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const usernameRaw = formData.get('username')
    const emailRaw = formData.get('email')
    const avatar = formData.get('avatar') as File | null

    const username =
      typeof usernameRaw === 'string' ? usernameRaw.trim() : user.username
    const email =
      typeof emailRaw === 'string' ? emailRaw.trim().toLowerCase() : user.email

    // ---- Validation ----
    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      )
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // ---- Duplicates (only if changed) ----
    if (username !== user.username) {
      const exists = await AdminUser.findOne({ username })
      if (exists) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        )
      }
      user.username = username
    }

    if ((email ?? '') !== (user.email ?? '').toLowerCase()) {
      if (email) {
        const exists = await AdminUser.findOne({ email })
        if (exists) {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 409 }
          )
        }
      }
      user.email = email
    }

    // ---- Avatar handling: delete old first, then upload new ----
    if (avatar) {
      // 1) Best-effort delete old
      const oldPublicId = extractFromUrl((user as any).avatarUrl || '')
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId, {
            resource_type: 'image',
            invalidate: true, // purge CDN cache of old asset
          })
        } catch (e) {
          console.warn('Cloudinary destroy failed for', oldPublicId, e)
          // Continue anyway — per Option B we accept the risk of having no old image now
        }
      }

      // 2) Upload new
      try {
        const newUrl = await uploadAvatarToFolder(avatar)
        user.avatarUrl = newUrl
      } catch (e: any) {
        // At this point, old image may already be deleted.
        // Return an error so client can prompt user to retry upload.
        return NextResponse.json(
          { error: e?.message || 'Failed to upload avatar' },
          { status: 415 }
        )
      }
    }

    await user.save()

    const { _id, role, active, avatarUrl, updatedAt } = user.toObject()
    return NextResponse.json({
      message: 'Profile updated',
      user: {
        id: String(_id),
        username: user.username,
        email: user.email ?? '',
        role,
        active,
        avatarUrl: avatarUrl ?? '',
        updatedAt,
      },
    })
  } catch (err) {
    console.error('PUT profile error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ---- Guard: tell clients where to change password now ----
export async function PATCH() {
  return NextResponse.json(
    { error: 'Use POST /api/admin-user/profile/change-password' },
    { status: 405 }
  )
}
