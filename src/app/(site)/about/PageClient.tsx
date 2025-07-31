'use client'

import './page.css'
import '@/styles/apearFrom.css'
import Image from 'next/image'
import appearFromRight from '@/lib/appearFrom/right'
import appearFromLeft from '@/lib/appearFrom/left'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'


export default function AboutClient() {
  const { t } = useTranslation()

  const fromRightRefsDiv = useRef<Array<HTMLDivElement | null>>([])
  const fromRightRefsSpan = useRef<Array<HTMLSpanElement | null>>([])
  const fromLeftRefsSpan = useRef<Array<HTMLSpanElement | null>>([])
  
  appearFromRight(fromRightRefsDiv.current, 'show', 0.15)
  appearFromRight(fromRightRefsSpan.current, 'show', 0.15)
  appearFromLeft(fromLeftRefsSpan.current, 'show', 0.15)

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          {/* Left: Text */}
          <div className="about-text">
            <span
              className="section-title-en appear-from-left"
              ref={(el) => {
                fromLeftRefsSpan.current[0] = el
              }}
            >
              ABOUT US
            </span>
            <h2
              className="section-title-th appear-from-right"
              ref={(el) => {
                fromRightRefsSpan.current[0] = el
              }}
            >
              {t(`about.headline`)}
            </h2>
            <p
              className="about-description appear-from-left"
              ref={(el) => {
                fromLeftRefsSpan.current[1] = el
              }}
            >
              {t(`about.description`)}
            </p>
            <p
              className="about-description appear-from-left"
              ref={(el) => {
                fromLeftRefsSpan.current[2] = el
              }}
            >
              {t(`about.description2`)}
            </p>
          </div>
          <div
            className="about-image-wrapper appear-from-right"
            ref={(el) => {
              fromRightRefsDiv.current[0] = el
            }}
          >
            <Image
              src="/images/about/Caroline_Team-min.png"
              alt="Caroline Clinic"
              width={400}
              height={600}
              className="about-image"
              blurDataURL="/images/about/Caroline_Team-min-blur.png" // If you generate one
            />
          </div>
        </div>
      </div>
    </section>
  )
}
