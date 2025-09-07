// src/app/(site)/services/PageClient.tsx
'use client'

import './page.css'
import './pageMedia.css'
import './linear-gradient-border.css'
import '@/styles/apearFrom.css'

import categorizedServices from './data.json'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import appearFromBottom from '@/lib/appearFrom/bottom'
import { useTranslation } from 'react-i18next'

export default function ServicesClient() {
  const { t } = useTranslation()

  // Elements to animate from bottom
  const fromBottomRefs = useRef<Array<HTMLDivElement | null>>([])

  // Reveal-on-load (consistent with other sections)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onLoad = () => setShow(true)
    window.addEventListener('load', onLoad)
    if (document.readyState === 'complete') onLoad()
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // Hook up intersection observers (TOP-LEVEL call)
  appearFromBottom(fromBottomRefs.current, {
    className: 'show',
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
    once: true,
    // Re-run when count changes (if JSON updates) or when the section is allowed to animate
    deps: [categorizedServices.length, show],
  })

  // Simple slug for hash IDs
  const toSlug = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <span className="section-title-en">SERVICE</span>
        <h2 className="section-title-th">{t('sectionTitles.services')}</h2>
        <p className="services-description">{t('services.subtitle')}</p>

        {show && (
          <div className="services-category-container">
            {categorizedServices.map((section, index) => (
              <div
                key={section.key ?? index}
                className="services-category appear-from-bottom"
                ref={(el) => {
                  fromBottomRefs.current[index] = el
                }}
              >
                <Link
                  href={`/services#category-${toSlug(section.category)}`}
                  className="category-title"
                >
                  <Image
                    src={section.image || '/default-category.png'}
                    alt={section.category}
                    width={150}
                    height={150}
                    className="services-example"
                  />
                  <span>{t(`services.${section.key}.title`)}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
