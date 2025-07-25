import { NextResponse } from 'next/server'
import Article from '@/models/Article'
import { connectToDB } from '@/lib/mongoose'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    const article = await Article.findById(params.id).lean()

    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
