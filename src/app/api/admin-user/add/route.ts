import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import AdminUser from '@/models/AdminUser'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// Helper function to convert a Buffer into a Node.js readable stream
function bufferToStream(buffer: Buffer) {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

// Main POST handler for adding a new admin user
export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectToDB()

    // Parse multipart/form-data from the incoming request
    const formData = await req.formData()
    const username = String(formData.get('username') || '')
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const role = String(formData.get('role') || 'viewer')
    // The 'active' field comes as string "true"/"false", convert to boolean
    const active = String(formData.get('active') ?? 'true') === 'true'
    // Get the avatar file (can be null if not provided)
    const avatar = formData.get('avatar') as File | null

    // Validate username (required, min 3 chars)
    if (!username.trim() || username.length < 3) {
      return NextResponse.json(
        { error: 'Username is required (min 3 chars)' },
        { status: 400 }
      )
    }
    // Validate password (required, min 6 chars)
    if (!password.trim() || password.length < 3) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check for duplicate username or email in the database
    const exists = await AdminUser.findOne({
      $or: [{ username }, { email }],
    })
    if (exists) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }

    // Securely hash the password using bcrypt before saving
    const hashedPassword = await bcrypt.hash(password, 12)

    // Default avatarUrl (empty if not uploaded)
    let avatarUrl = ''
    // If the user uploaded an avatar, upload it to Cloudinary
    if (avatar) {
      // Accept only image files
      if (!avatar.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files allowed for avatar' },
          { status: 415 }
        )
      }

      // Read the file content into a Buffer
      const arrayBuffer = await avatar.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const stream = bufferToStream(buffer)

      // Upload the image to Cloudinary, into "admin-avatars" folder,
      // auto-crop to face, resize to 300x300, and optimize quality
      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const cloudinaryStream = cloudinary.uploader.upload_stream(
            {
              folder: 'admin-user',
              quality: 'auto', // Let Cloudinary optimize image
              crop: 'thumb', // Crop to thumbnail
              width: 300,
              height: 300,
            },
            (error, result) => {
              if (error) return reject(error)
              resolve(result as any)
            }
          )
          // Pipe the file buffer stream into Cloudinary's upload stream
          stream.pipe(cloudinaryStream)
        }
      )
      // Store Cloudinary public URL
      avatarUrl = uploadResult.secure_url
    }

    // Create and save the new admin user in MongoDB
    const newUser = await AdminUser.create({
      username,
      email,
      password: hashedPassword,
      role,
      active,
      avatarUrl, // Save Cloudinary image URL (empty if no avatar)
    })

    // Respond with the created user info (omit password in real API)
    return NextResponse.json(
      { message: 'Admin user created', user: newUser },
      { status: 201 }
    )
  } catch (err: any) {
    // Handle any unexpected errors
    console.error('❌ Error creating admin user:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
