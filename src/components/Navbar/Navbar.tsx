'use client'

import { useState } from 'react'
import Link from 'next/link'
import './Navbar.css'

const navItems = [
  { label: 'หน้าแรก', href: '/' },
  { label: 'บริการ', href: '/services' },
  { label: 'เกี่ยวกับเรา', href: '/about' },
  { label: 'รีวิว', href: '/review' },
  { label: 'โปรโมชั่น', href: '/promotion' },
  { label: 'บทความ', href: '/article' },
  { label: 'ติดต่อ', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <Link
          href="/"
          className={`navbar-logo ${menuOpen ? 'hidden-move-up' : 'visible'}`}
        >
          <img
            src="/Caroline-Clinic-Logo.svg"
            alt="Caroline Clinic Logo"
            className="navbar-logo-img"
          />
        </Link>
        <div className={`navbar-Logo-mirage ${menuOpen ? 'display-none' : ''}`}></div>
        {/* Desktop Menu */}
        <ul className="navbar-menu desktop-only">
          {navItems.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="navbar-link">
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger Icon */}
        <button
          className="navbar-toggle mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger" />
          <span className="hamburger" />
          <span className="hamburger" />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <ul className="navbar-menu-mobile mobile-only">
          {navItems.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="navbar-link"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
