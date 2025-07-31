'use client'

import './Footer.css'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitcher from '../Navbar/LanguageSwitcher'
import { useTranslation } from 'react-i18next'


export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer>
      <div className="footer-inner">
        {/* Column 1: Logo & tagline */}
        <div className="footer-column">
          <Link href="/" className="footer-logo">
            <Image
              src="/logo/Caroline-Clinic-Logo.svg"
              alt="Caroline Clinic Logo"
              className="footer-logo-img"
              width={180}
              height={180}
            />
          </Link>
          <p className="footer-tagline">{t(`footer.logo_desc`)}</p>
        </div>

        {/* Column 2: Socials */}
        <div className="footer-column">
          <h3 className="footer-title">Social Media</h3>
          <div className="footer-socials">
            <a
              href="https://www.facebook.com/profile.php?id=61557946943788"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/Facebook_logo.png"
                alt="Facdbook Logo"
                className="footer-facdbook-logo"
                width={100}
                height={100}
              />
            </a>
            <a
              href="https://www.instagram.com/caroline.clinic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/Instagram_logo.png"
                alt="Instagram Logo"
                className="footer-instagram-logo"
                width={100}
                height={100}
              />
            </a>
            <a
              href="https://line.me/R/ti/p/@104jsghy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/Line_logo.png"
                alt="Line Logo"
                className="footer-line-logo"
                width={100}
                height={100}
              />
            </a>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-column">
          <h3 className="footer-title">{t(`contact.headline`)}</h3>
          <p>
            {t(`contact.phone`)}: <a href="tel:0647762422">064-776-2422</a>
          </p>
          <p>
            LINE ID:{' '}
            <a
              href="https://line.me/R/ti/p/@104jsghy"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Caroline.Clinic
            </a>
          </p>
          <a
            href="https://maps.app.goo.gl/VxFkESDBwmqgr8Jh6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>{t(`contact.addressInfo`)}</p>
          </a>

          <p> {t(`contact.open_time_`)}</p>
        </div>
      </div>
      <LanguageSwitcher />
      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bar-gradient" />
        <p>
          © {new Date().getFullYear()} Caroline Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
