// src/app/api/cloudinary/promotion/delete/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

type Body = { public_id?: string } | { public_ids?: string[] }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body

    // ---- Single delete ----
    if ('public_id' in body && body.public_id) {
      // Optional: lock to folder
      // if (!body.public_id.startsWith('promotion/')) {
      //   return NextResponse.json({ error: 'Invalid public_id' }, { status: 400 })
      // }

      const result = await cloudinary.uploader.destroy(body.public_id, {
        resource_type: 'image',
        invalidate: true,
      })
      if (result.result !== 'ok' && result.result !== 'not found') {
        return NextResponse.json(
          { error: 'Delete failed', detail: result },
          { status: 500 }
        )
      }
      return NextResponse.json({ ok: true })
    }

    // ---- Bulk delete ----
    if (
      'public_ids' in body &&
      Array.isArray(body.public_ids) &&
      body.public_ids.length > 0
    ) {
      // Optional: validate all IDs are under "promotion/"
      // if (!body.public_ids.every((id) => id.startsWith('promotion/'))) {
      //   return NextResponse.json({ error: 'Invalid public_ids' }, { status: 400 })
      // }

      const result = await cloudinary.api.delete_resources(body.public_ids, {
        resource_type: 'image',
        invalidate: true,
      })
      return NextResponse.json({ ok: true, result })
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  } catch (err) {
    console.error('Cloudinary promotion delete error:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
