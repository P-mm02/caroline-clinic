import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Article from '@/models/Article'
import { connectToDB } from '@/lib/mongoose'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary config (can move to global/init if needed)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// Utility: Extract public ID from Cloudinary image URL
function extractPublicId(url: string): string | null {
  // Example: https://res.cloudinary.com/demo/image/upload/v123456/articles/filename.jpg
  // Want: articles/filename (no extension, no version, no domain)
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)\.[a-zA-Z0-9]+$/)
  return match ? match[1] : null
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
  try {
    await connectToDB()
    const { id } = await context.params // Await the params Promise

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID.' },
        { status: 400 }
      )
    }

    // 1. Find the article (get image URLs)
    const article = await Article.findById(id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 })
    }

    // 2. Delete all related Cloudinary images
    const imagesToDelete: string[] = []

    // Add cover image
    if (article.image) {
      const publicId = extractPublicId(article.image)
      if (publicId) imagesToDelete.push(publicId)
    }

    // Add all content images
    if (Array.isArray(article.contents)) {
      for (const content of article.contents) {
        if (content.image) {
          const publicId = extractPublicId(content.image)
          if (publicId) imagesToDelete.push(publicId)
        }
      }
    }

    // Bulk delete images on Cloudinary
    const deletePromises = imagesToDelete.map(async (publicId) => {
      try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true })
        console.log(`Successfully deleted image: ${publicId}`)
      } catch (error) {
        console.error(`Failed to delete image ${publicId}:`, error)
        // Don't throw here - continue with other deletions
      }
    })

    await Promise.allSettled(deletePromises) // Use allSettled to handle partial failures

    // 3. Delete the article from MongoDB
    await Article.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Article and images deleted.',
    })
  } catch (err: any) {
    console.error('Error deleting article:', err)
    return NextResponse.json(
      { error: err.message || 'Server error.' },
      { status: 500 }
    )
  }
}

// Support POST for delete (optional) - also updated for Next.js 15
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return DELETE(req, context)
}
