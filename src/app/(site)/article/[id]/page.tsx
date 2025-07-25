// src/app/(site)/article/[id]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Article from '@/models/Article'
import { connectToDB } from '@/lib/mongoose'
import './page.css'

// ✅ Updated type definition for Next.js 15
type ArticlePageProps = {
  params: Promise<{
    id: string
  }>
}

// ✅ Await params before using
export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  // Await the params Promise
  const { id } = await params

  await connectToDB()

  const article = await Article.findById(id).lean()

  if (!article || !('title' in article)) return notFound()

  return (
    <main className="article-detail">
      <div className="article-detail-container">
        <h1 className="article-detail-title">{article.title}</h1>
        <div className="article-detail-meta">
          <span>{article.date}</span> | <span>{article.author}</span>
        </div>

        {article.image && (
          <div className="article-detail-main-image">
            <Image
              src={article.image}
              alt={article.title}
              width={960}
              height={480}
              className="article-detail-img"
              priority
            />
          </div>
        )}

        <p className="article-detail-description">{article.description}</p>

        {article.contents?.map((item: any, i: number) => (
          <div key={i} className="article-detail-content-row">
            {item.image && (
              <div className="article-detail-subimage">
                <Image
                  src={item.image}
                  alt={`content-${i}`}
                  width={720}
                  height={360}
                  className="article-detail-img"
                />
              </div>
            )}
            <p className="article-detail-text">{item.text}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
