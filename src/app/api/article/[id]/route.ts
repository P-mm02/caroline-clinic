import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Article from '@/models/Article'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  await connectToDB()
  const article = await Article.findById(id).lean()

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(article)
}
