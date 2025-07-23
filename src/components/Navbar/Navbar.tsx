'use client'

import '@/i18n';
import { useState } from 'react'
import Link from 'next/link'
import './Navbar.css'
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

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
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false)  

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <Link
          href="/"
          className={`navbar-logo ${menuOpen ? 'hidden-move-up' : 'visible'}`}
        >
          <img
            src="/logo/Caroline-Clinic-Logo.svg"
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
                {t(`navbar.${label}`)}
              </a>
            </li>
          ))}
          <LanguageSwitcher />
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
