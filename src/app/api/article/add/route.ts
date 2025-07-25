import { NextResponse } from 'next/server'
import {connectToDB} from '@/lib/mongoose'
import Article from '@/models/Article'

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectToDB()

    const body = await req.json()

    const {
      title = '',
      description = '',
      image = '',
      date = '',
      author = '',
      contents = [],
    } = body

    // Basic validation
    if (!title.trim() || !description.trim()) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Create the article
    const newArticle = await Article.create({
      title,
      description,
      image,
      date,
      author,
      contents,
    })

    return NextResponse.json(
      { message: 'Article created', article: newArticle },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('❌ Error creating article:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
