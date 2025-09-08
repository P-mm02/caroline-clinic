// src/app/api/cloudinary/promotion/upload/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

export const runtime = 'nodejs'

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
        folder: 'promotion',
        quality: 'auto', // smart server-side compression
        use_filename: true, // keep human-friendly base name
        unique_filename: true, // avoid collisions
        overwrite: false,
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
      if (!f.type?.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 415 }
        )
      }
    }

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
    console.error('Cloudinary promotion upload error:', err)
    const message = err?.error?.message || err?.message || 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
