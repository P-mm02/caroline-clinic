'use client'

import './page.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ArticleType } from '@/types/ArticleType'
import { useTranslation } from 'react-i18next'


type Props = {
  limit?: number
}

export default function ArticleClient({ limit }: Props) {
  const { t } = useTranslation()
  const [articles, setArticles] = useState<ArticleType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/article')
      .then((res) => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then((data: ArticleType[]) => {
        setArticles(data)
        setLoading(false)
      })
      .catch(() => {
        setError('โหลดบทความล้มเหลว')
        setLoading(false)
      })
  }, [])

  const visibleArticles = limit ? articles.slice(0, limit) : articles

  return (
    <section id="article" className="article-section">
      <div className="article-container">
        <span className="section-title-en">BLOG</span>
        <h2 className="section-title-th">{t(`articles.headline`)}</h2>
        <p className="article-description">{t(`articles.desc`)}</p>
        {loading ? (
          <div className="article-list-loading">Loading...</div>
        ) : error ? (
          <div className="article-list-error">{error}</div>
        ) : visibleArticles.length === 0 ? (
          <div className="article-list-empty">ยังไม่มีบทความในขณะนี้</div>
        ) : (
          <div className="article-list">
            {visibleArticles.map((article, idx) => (
              <Link
                key={article.title || idx}
                href={'/article/' + article._id || '#'}
                className="article-card"
                aria-label={`อ่าน ${article.title}`}
              >
                <div className="article-card-image-wrapper">
                  <img
                    src={article.image || '/placeholder.jpg'}
                    alt={article.title}
                    width={360}
                    height={360}
                    className="article-card-image"
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="article-card-meta">
                  <span className="article-card-date">
                    {article.date
                      ? new Date(article.date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </span>
                  <span className="article-card-author">{article.author}</span>
                </div>
                <h3 className="article-card-title">{article.title}</h3>
                <p className="article-card-desc">{article.description}</p>
              </Link>
            ))}
          </div>
        )}

        {limit && articles.length > limit && (
          <div className="article-more-wrapper">
            <Link href="/article" className="article-more-button">
              {t(`articles.see_all`)}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
