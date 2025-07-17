'use client'

import { useState } from 'react'
import './AdminArticleTable.css'

type Article = {
  id: string
  title: string
  description: string
  image: string
  date: string
  author: string
  tags: string[]
  href: string
}

type Props = {
  articles: Article[]
}

type SortKey = 'title' | 'author' | 'date'

export default function AdminArticleTable({ articles: articlesRaw }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const articles = [...articlesRaw].sort((a, b) => {
    if (sortKey === 'date') {
      return sortDir === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    const aValue = (a[sortKey] as string).toLowerCase()
    const bValue = (b[sortKey] as string).toLowerCase()
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const getArrow = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' ▲' : ' ▼'
  }

  return (
    <div className="admin-article-table-wrap">
      <table className="admin-article-table">
        <thead>
          <tr>
            <th>No.</th>
            <th
              className="sortable-th"
              onClick={() => handleSort('title')}
              style={{ cursor: 'pointer' }}
            >
              Title{getArrow('title')}
            </th>
            <th
              className="sortable-th"
              onClick={() => handleSort('author')}
              style={{ cursor: 'pointer' }}
            >
              Author{getArrow('author')}
            </th>
            <th
              className="sortable-th"
              onClick={() => handleSort('date')}
              style={{ cursor: 'pointer' }}
            >
              Date{getArrow('date')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a, i) => (
            <tr key={i + 1}>
              <td>{i + 1}</td>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{new Date(a.date).toLocaleDateString('th-TH')}</td>
              <td>
                <a
                  href={`/admin/articles/edit/${a.id}`}
                  className="admin-article-action"
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="admin-article-action admin-article-action-danger"
                >
                  Delete
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
