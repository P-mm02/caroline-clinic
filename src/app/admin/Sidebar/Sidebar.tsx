// src/app/admin/Sidebar/Sidebar.tsx

import Link from 'next/link'
import './Sidebar.css' // You can create this CSS file for custom sidebar styles

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">Caroline Admin</div>
      <nav className="admin-nav">
        <Link href="/admin" className="admin-nav-link">
          Home
        </Link>
        <Link href="/admin/article" className="admin-nav-link">
          Articles
        </Link>
        <Link href="/admin/review" className="admin-nav-link">
          Reviews
        </Link>
        <Link href="/admin/promotion" className="admin-nav-link">
          Promotions
        </Link>
        <Link href="/admin/service" className="admin-nav-link">
          Services
        </Link>
        <div className="admin-nav-separator" />
        <Link href="/admin/logout" className="admin-logout">
          Logout
        </Link>{' '}
      </nav>
    </aside>
  )
}
