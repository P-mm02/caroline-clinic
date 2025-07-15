'use client'

import './page.css'
import './pageMedia.css'
import './linear-gradient-border.css'
import '@/styles/apearFrom.css'
import categorizedServices from './data.json'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import appearFromBottom from '@/lib/appearFrom/bottom'

export default function ServicesClient() {
  const fromBottomRefs = useRef<Array<HTMLDivElement | null>>([])

  appearFromBottom(fromBottomRefs.current, 'show', 0.15)
  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <span className="section-title-en">SERVICE</span>
        <h2 className="section-title-th">บริการของเรา</h2>
        <p className="services-description">
          Caroline Clinic offers a full range of beauty services provided by
          expert physicians and modern equipment.
        </p>
        <div className="services-category-container">
          {categorizedServices.map((section, index) => (
            <div
              key={index}
              className="services-category appear-from-bottom"
              ref={(el) => {
                fromBottomRefs.current[index] = el
              }}
            >
              <Link
                href={`/services#category-${section.category
                  .replace(/\s+/g, '-')
                  .toLowerCase()}`}
                className="category-title"
              >
                <Image
                  src={section.image || '/default-category.png'}
                  alt={section.category}
                  width={150}
                  height={150}
                  className="services-example"
                />
                {section.category}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
