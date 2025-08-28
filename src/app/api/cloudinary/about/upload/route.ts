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
  // @ts-ignore
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

async function uploadOne(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const stream = bufferToStream(buffer)

  return new Promise<any>((resolve, reject) => {
    const up = cloudinary.uploader.upload_stream(
      {
        folder: 'about',
        quality: 'auto', // Cloudinary will compress smartly
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.pipe(up)
  })
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const files = form.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Validate types
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 415 }
        )
      }
    }

    const results = []
    for (const f of files) {
      const r = await uploadOne(f)
      results.push({
        public_id: r.public_id,
        secure_url: r.secure_url,
        bytes: r.bytes,
        width: r.width,
        height: r.height,
      })
    }

    return NextResponse.json({ uploaded: results })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
