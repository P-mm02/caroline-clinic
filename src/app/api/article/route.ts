import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Article from '@/models/Article'

export async function GET() {
  await connectToDB()
  const articles = await Article.find().sort({ date: -1 })
  return NextResponse.json(articles)
}
