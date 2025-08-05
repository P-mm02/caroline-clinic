// src/app/api/upload/admin-user/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

function bufferToStream(buffer: Buffer) {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files allowed' },
        { status: 415 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const stream = bufferToStream(buffer)

    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            folder: 'admin-avatars',
            quality: 'auto',
            crop: 'thumb',
            gravity: 'face', // auto-crop face if detected
            width: 300,
            height: 300,
            public_id: undefined, // auto-generate or set your own logic
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result as any)
          }
        )
        stream.pipe(cloudinaryStream)
      }
    )

    return NextResponse.json({ url: uploadResult.secure_url })
  } catch (err) {
    console.error('Cloudinary avatar upload failed:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
