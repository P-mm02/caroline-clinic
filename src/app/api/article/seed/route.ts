import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Article from '@/models/Article'
import articles from '@/data/article.json'

export async function POST() {
  console.log('Seeding articles... (clearing all existing articles first)')
  await connectToDB()

  // DANGER: This will remove ALL articles before seeding!
  await Article.deleteMany({})

  let inserted = 0
  for (const data of articles) {
    await Article.create(data)
    inserted++
  }

  return NextResponse.json({
    ok: true,
    message: `Seed completed: ${inserted} inserted. All previous articles were removed.`,
  })
}

export async function GET() {
  return POST()
}
