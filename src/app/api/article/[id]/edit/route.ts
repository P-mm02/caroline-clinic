import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Article from '@/models/Article'
import {
  collectImageChanges,
  ImageChange,
} from '@/utils/imageHelpers'

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Parse the request body
    const body = await req.json()

    // Connect to database
    await connectToDB()

    // Validate that the article exists
    const existingArticle = await Article.findById(id)
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Extract fields from request body
    const {
      title,
      description,
      image,
      date,
      author,
      contents,
      href,
      ...otherFields
    } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Validate contents array
    if (!Array.isArray(contents)) {
      return NextResponse.json(
        { error: 'Contents must be an array' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      description: description.trim(),
      image: image || '',
      date: date || new Date().toISOString().split('T')[0], // Default to today if not provided
      author: author?.trim() || '',
      contents: contents.map((content: any) => ({
        image: content.image || '',
        text: content.text || '',
      })),
      href:
        href ||
        `/article/${encodeURIComponent(
          title.replace(/\s+/g, '-').toLowerCase()
        )}`,
      updatedAt: new Date(),
      ...otherFields,
    }

    // === IMAGE CHANGES SECTION (what you requested) ===
    const imageChanges: ImageChange[] = collectImageChanges(
      existingArticle,
      updateData
    )
    if (imageChanges.length > 0) {
      // Send to the delete route (POST)
      // Use request headers for current domain
      const protocol = req.headers.get('x-forwarded-proto') || 'http'
      const host = req.headers.get('host')
      const apiUrl = `${protocol}://${host}/api/article/${id}/delete`

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes: imageChanges }),
      })
      // Note: You might want to handle the response (optional)
    }
    // ================================================

    // Update the article in the database
    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    }).lean()

    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Failed to update article' },
        { status: 500 }
      )
    }

    // Return success response with updated article
    return NextResponse.json({
      message: 'Article updated successfully',
      article: updatedArticle,
    })
  } catch (error: any) {
    console.error('Error updating article:', error)

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error: ' + error.message },
        { status: 400 }
      )
    }

    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid article ID format' },
        { status: 400 }
      )
    }

    // Generic server error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
