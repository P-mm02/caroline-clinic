import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Article from '@/models/Article'

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
      coverFile, // This should be undefined as per frontend logic
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

    // Remove any undefined or file-related fields that shouldn't be saved
    delete updateData.coverFile

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
