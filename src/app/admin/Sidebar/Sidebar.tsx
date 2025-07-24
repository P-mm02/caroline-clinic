'use client'
import Link from 'next/link'
import { useState } from 'react'
import './Sidebar.css'

export default function AdminSidebar() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)

  function toggleSidebar() {
    setIsOpenSidebar((prev) => !prev)
  }

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        aria-label={'isOpenSidebar'}
        onClick={toggleSidebar}
      >
        {isOpenSidebar ? '✖' : '☰'}
      </button>
      <div
        className={`sidebar-overlay${isOpenSidebar ? ' show' : ''}`}
        onClick={toggleSidebar}
      ></div>

      <aside className={`admin-sidebar${isOpenSidebar ? ' show' : ''}`}>
        <div className="admin-brand">Admin Panel</div>
        <nav className="admin-nav">
          <Link
            href="/admin"
            className="admin-nav-link"
            onClick={toggleSidebar}
          >
            Home
          </Link>
          <Link
            href="/admin/article"
            className="admin-nav-link"
            onClick={toggleSidebar}
          >
            Articles
          </Link>
          <Link
            href="/admin/review"
            className="admin-nav-link"
            onClick={toggleSidebar}
          >
            Reviews
          </Link>
          <Link
            href="/admin/promotion"
            className="admin-nav-link"
            onClick={toggleSidebar}
          >
            Promotions
          </Link>
          <Link
            href="/admin/service"
            className="admin-nav-link"
            onClick={toggleSidebar}
          >
            Services
          </Link>
          <div className="admin-nav-separator" />
          <Link
            href="/admin/logout"
            className="admin-logout"
            onClick={toggleSidebar}
          >
            Logout
          </Link>
        </nav>
      </aside>
    </>
  )
}
