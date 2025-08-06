'use client'

import './page.css'
import './pageMedia.css'
import Image from 'next/image'
import promotions from './data.json'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  limit?: number
}

export default function PromotionClient({ limit }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onLoad() {
      setShow(true)
    }
    window.addEventListener('load', onLoad)
    if (document.readyState === 'complete') onLoad()
    return () => window.removeEventListener('load', onLoad)
  }, [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScrollActive, setAutoScrollActive] = useState(false)
  const [direction, setDirection] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useTranslation()

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pause = useCallback(() => setAutoScrollActive(false), [])
  const resume = useCallback(() => setAutoScrollActive(true), [])

  const visiblePromotions = limit ? promotions.slice(0, limit) : promotions

const scrollBy = useCallback((amount: number) => {
  if (!show) return;
  scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
}, [show]);

  useEffect(() => {
    if (!show) return;
    const container = scrollRef.current
    if (!container) return

    const observer = new window.IntersectionObserver(
      ([entry]) => setAutoScrollActive(entry.isIntersecting),
      { root: null, threshold: 0.1 }
    )
    observer.observe(container)
    return () => {
      observer.disconnect()
    }
  }, [show])

  useEffect(() => {
    if (!show) return;
    if (!autoScrollActive) return
    const container = scrollRef.current
    if (!container) return

    const scrollStep = isMobile ? 320 : 640

    const handle = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth
      const atStart = container.scrollLeft <= 16
      const atEnd = container.scrollLeft >= maxScroll - 16

      setDirection(dir => {
        if (atEnd) return -1
        if (atStart) return 1
        return dir
      })

      container.scrollBy({
        left: scrollStep * direction,
        behavior: 'smooth',
      })
    }, 2000)
    return () => clearInterval(handle)
  }, [show, autoScrollActive, direction, isMobile])

const canScrollLeft = () => show && (scrollRef.current?.scrollLeft ?? 0) > 0
const canScrollRight = () => {
  if (!show) return false
  const el = scrollRef.current
  return el ? el.scrollLeft < el.scrollWidth - el.clientWidth - 10 : false
}

  return (
    <section id="promotion" className="promotion-section">
      <div className="promotion-container">
        <span className="section-title-en">PROMOTION</span>
        <h2 className="section-title-th">{t(`promotions.headline`)}</h2>
        <p className="promotion-description">{t(`promotions.desc`)}</p>
          <div 
            className="promotion-slider-container" 
            onMouseEnter={pause}
            onMouseLeave={resume}>
            <button
              className="promotion-arrow left"
              onClick={() => scrollBy(isMobile ? -320 : -640)}
              aria-label="เลื่อนไปทางซ้าย"
              disabled={!canScrollLeft()}
              tabIndex={0}
            >
              ◀
            </button>
            <button
              className="promotion-arrow right"
              onClick={() => scrollBy(isMobile ? 320 : 640)}
              aria-label="เลื่อนไปทางขวา"
              disabled={!canScrollRight()}
              tabIndex={0}
            >
              ▶
            </button>
            {show && (
            <div className="promotion-slider-wrapper" ref={scrollRef}>
              <div className="promotion-list">
                {visiblePromotions.map((promo, index) => (
                  <div key={index} className="promotion-card snap-start">
                    <div className="promotion-image-wrapper">
                      <Image
                        src={promo.image}
                        alt={promo.title}
                        width={375}
                        height={450}
                        className="promotion-image"
                        loading="eager"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

          </div>

        {limit && (
          <div>
            <a href="/promotion" className="promotion-more-button">
              {t(`promotions.see_all`)}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}