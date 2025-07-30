'use client'

import '@/i18n'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import Image from 'next/image'
import './Navbar.css'

const navItems = [
  { label: 'home', href: '/' },
  { label: 'services', href: '/services' },
  { label: 'about', href: '/about' },
  { label: 'review', href: '/review' },
  { label: 'promotion', href: '/promotion' },
  { label: 'article', href: '/article' },
  { label: 'contact', href: '/contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevent hydration errors

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <Link
          href="/"
          className={`navbar-logo ${menuOpen ? 'hidden-move-up' : 'visible'}`}
        >
          <Image
            src="/logo/Caroline-Clinic-Logo.svg"
            alt="Caroline Clinic Logo"
            className="navbar-logo-img"
            width={300}
            height={300}
            priority
          />
        </Link>
        <div
          className={`navbar-Logo-mirage ${menuOpen ? 'display-none' : ''}`}
        ></div>
        {/* Desktop Menu */}
        <ul className="navbar-menu desktop-only">
          {navItems.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="navbar-link">
                {t(`navbar.${label}`)}
              </a>
            </li>
          ))}
          <LanguageSwitcher />
        </ul>
        {/* Hamburger Icon */}
        <button
          className="navbar-toggle mobile-only"
          onClick={() => setMenuOpen((prev) => !prev)}
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
                {t(`navbar.${label}`)}
              </a>
            </li>
          ))}
          <LanguageSwitcher />
        </ul>
      )}
    </header>
  )
}
