'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import './Sidebar.css'

export default function AdminSidebar() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const pathname = usePathname()

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
        onClick={() => setIsOpenSidebar(false)}
      ></div>

      <aside className={`admin-sidebar${isOpenSidebar ? ' show' : ''}`}>
        <div className="admin-brand">Admin Panel</div>
        <nav className="admin-nav">
          <Link
            href="/admin"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            Home
          </Link>
          <Link
            href="/admin/about"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            About
          </Link>
          <Link
            href="/admin/article"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            Articles
          </Link>
          <Link
            href="/admin/"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            Reviews
          </Link>
          <Link
            href="/admin/"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            Promotions
          </Link>
          <Link
            href="/admin/"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            Services
          </Link>
          <Link
            href="/admin/admin-user"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            Member
          </Link>
          <div className="admin-nav-separator" />
          {pathname !== '/admin/login' && (
            <Link
              href="/admin/logout"
              className="admin-logout"
              onClick={() => setIsOpenSidebar(false)}
            >
              Logout
            </Link>
          )}
          <Link
            href="/"
            className="admin-nav-link"
            onClick={() => setIsOpenSidebar(false)}
          >
            Website
          </Link>
        </nav>
      </aside>
    </>
  )
}
