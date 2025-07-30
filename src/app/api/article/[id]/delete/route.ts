import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Article from '@/models/Article'
import { connectToDB } from '@/lib/mongoose'
import { v2 as cloudinary } from 'cloudinary'
import { extractPublicId } from '@/utils/imageHelpers'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

async function deleteCloudinaryImages(imageUrls: string[]) {
  const publicIds = imageUrls
    .map(extractPublicId)
    .filter((id): id is string => Boolean(id)) // Only keep non-null strings

  const deletePromises = publicIds.map(async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId, { invalidate: true })
      console.log(`Successfully deleted image: ${publicId}`)
    } catch (error) {
      console.error(`Failed to delete image ${publicId}:`, error)
    }
  })

  await Promise.allSettled(deletePromises)
  return publicIds.length
}

// DELETE: Delete the article and all related Cloudinary images
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB()
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID.' },
        { status: 400 }
      )
    }

    // 1. Find the article (get all image URLs)
    const article = await Article.findById(id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 })
    }

    // 2. Collect all image URLs (cover + contents)
    const imageUrls: string[] = []
    if (article.image) imageUrls.push(article.image)
    if (Array.isArray(article.contents)) {
      for (const content of article.contents) {
        if (content.image) imageUrls.push(content.image)
      }
    }

    // 3. Delete all images from Cloudinary
    await deleteCloudinaryImages(imageUrls)

    // 4. Delete the article from MongoDB
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

// POST: Only delete specific images (used for edit/replace flows)
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB()
    // We don't need to validate the ID if not deleting the article itself

    const { changes } = await req.json()
    if (!Array.isArray(changes)) {
      return NextResponse.json(
        { error: 'No changes array provided.' },
        { status: 400 }
      )
    }

    // changes: Array of { oldUrl, newUrl }
    const oldUrls = changes.map((c) => c.oldUrl).filter(Boolean)
    const deletedCount = await deleteCloudinaryImages(oldUrls)

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
    })
  } catch (err: any) {
    console.error('Error in POST /api/article/[id]/delete:', err)
    return NextResponse.json(
      { error: err.message || 'Server error.' },
      { status: 500 }
    )
  }
}
