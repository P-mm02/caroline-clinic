'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './page.css'

type Article = {
  title: string
  date: string
  author: string
  image?: string
  description?: string
  contents?: { image?: string; text: string }[]
}

export default function PageClient({ id }: { id: string }) {
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/article/${id}`)
        if (!res.ok) {
          router.push('/not-found') // optional redirect
          return
        }

        const data = await res.json()
        setArticle(data)
        console.log(data)
        
      } catch (err) {
        console.error('Failed to fetch article:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id, router])

  if (loading) return <div>Loading...</div>
  if (!article) return <div>Article not found.</div>

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
              width={1920}
              height={1920}
              className="article-detail-img"
              priority
            />
          </div>
        )}

        <p className="article-detail-description">{article.description}</p>

        {article.contents?.map((item, i) => (
          <div key={i} className="article-detail-content-row">
            {item.image && (
              <div className="article-detail-subimage">
                <Image
                  src={item.image}
                  alt={`content-${i}`}
                  width={1440}
                  height={1440}
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
