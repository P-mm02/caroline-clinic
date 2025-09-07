// src/app/api/cloudinary/review/list/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary SDK needs Node APIs
export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const next = searchParams.get('next') ?? undefined

    const query = cloudinary.search
      .expression('folder:review AND resource_type:image')
      .sort_by('created_at', 'desc') // newest first
      .max_results(100)

    if (next) query.next_cursor(next)

    const result = await query.execute()

    const resources = (result.resources ?? []).map((r: any) => ({
      asset_id: r.asset_id,
      public_id: r.public_id,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      secure_url: r.secure_url,
      created_at: r.created_at,
    }))

    return NextResponse.json({
      resources,
      next_cursor: result.next_cursor ?? null,
    })
  } catch (err) {
    console.error('Cloudinary review list error:', err)
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    )
  }
}
