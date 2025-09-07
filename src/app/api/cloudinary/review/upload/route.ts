// src/app/api/cloudinary/review/upload/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Ensure this runs in a Node.js runtime (Cloudinary SDK requires Node APIs)
export const runtime = 'nodejs'

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// Convert a Buffer into a Node stream for upload_stream
function bufferToStream(buffer: Buffer) {
  const readable = new Readable()
  // @ts-ignore - we’re manually controlling reads
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

// Upload a single File to Cloudinary -> folder: "review"
async function uploadOne(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const stream = bufferToStream(buffer)

  return new Promise<any>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: 'review',
        // Let Cloudinary optimize delivery automatically
        // (You’ll still request f_auto,q_auto on the client for thumbs/full)
        quality: 'auto',
        // Keep original filename basis (still unique on Cloudinary)
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.pipe(upload)
  })
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const files = form.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Basic validation: images only
    for (const f of files) {
      if (!f.type?.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 415 }
        )
      }
    }

    // Upload sequentially (clearer progress / lower memory spikes)
    const results: Array<{
      public_id: string
      secure_url: string
      bytes: number
      width: number
      height: number
      format?: string
      created_at?: string
      asset_id?: string
    }> = []

    for (const f of files) {
      const r = await uploadOne(f)
      results.push({
        public_id: r.public_id,
        secure_url: r.secure_url,
        bytes: r.bytes,
        width: r.width,
        height: r.height,
        format: r.format,
        created_at: r.created_at,
        asset_id: r.asset_id,
      })
    }

    return NextResponse.json({ uploaded: results })
  } catch (err: any) {
    console.error('Cloudinary review upload error:', err)
    // Try to surface Cloudinary error info if available
    const message = err?.error?.message || err?.message || 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
