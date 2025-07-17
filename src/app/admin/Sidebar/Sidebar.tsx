'use client'
import Link from 'next/link'
import { useState } from 'react'
import './Sidebar.css'

export default function AdminSidebar() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true)

  function toggleSidebar() {
    setIsOpenSidebar((prev) => !prev)
  }

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        aria-label={isOpenSidebar ? 'Close sidebar' : 'Open sidebar'}
        onClick={toggleSidebar}
      >
        {isOpenSidebar ? '✖' : '☰'}
      </button>
      <aside className={`admin-sidebar${isOpenSidebar ? ' show' : ''}`}>
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
          </Link>
        </nav>
      </aside>
    </>
  )
}
