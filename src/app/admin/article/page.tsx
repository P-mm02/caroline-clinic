'use client'

import { useEffect, useState } from 'react'
import AdminArticleTable from './AdminArticleTable/AdminArticleTable'
import type { ArticleType } from '@/types/ArticleType'
import './page.css'

export default function AdminArticlePage() {
  const [articles, setArticles] = useState<(ArticleType & { _id: string })[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/article')
      .then((res) => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then((data) => {
        setArticles(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load articles')
        setLoading(false)
      })
  }, [])

  return (
    <section className="admin-article-list">
      <h2 className="admin-article-title">Articles</h2>
      <p className="admin-article-desc text-center">
        Click any article in the list to view details, edit, or remove.
      </p>
      <a href="/admin/article/add" className="admin-article-add-btn">
        + Add New Article
      </a>

      {loading ? (
        <div className="admin-article-loading">Loading...</div>
      ) : error ? (
        <div className="admin-article-error">{error}</div>
      ) : (
        <AdminArticleTable articles={articles} />
      )}
    </section>
  )
}
