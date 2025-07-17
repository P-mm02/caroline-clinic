import articles from '@/app/(site)/article/data.json'
import AdminArticleTable from './AdminArticleTable/AdminArticleTable'
import './page.css'

export default function AdminArticlePage() {
  return (
    <section className="admin-article-list">
      <h2 className="admin-article-title">Articles</h2>
      <p className="admin-article-desc">
        View, edit, or remove articles published on the clinic site.
      </p>
      <a href="/admin/articles/add" className="admin-article-add-btn">
        + Add New Article
      </a>
      <AdminArticleTable articles={articles} />
    </section>
  )
}
