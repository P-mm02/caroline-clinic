'use client'

import './page.css'
import './pageMedia.css'
import Image from 'next/image'
import promotions from './data.json'
import { useEffect, useRef, useState, useCallback } from 'react'

type Props = {
  limit?: number
}

export default function PromotionClient({ limit }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScrollActive, setAutoScrollActive] = useState(false)
  const [direction, setDirection] = useState(1)

  const pause = useCallback(() => setAutoScrollActive(false), [])
  const resume = useCallback(() => setAutoScrollActive(true), [])

  const visiblePromotions = limit ? promotions.slice(0, limit) : promotions

  const scrollBy = useCallback((amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const observer = new window.IntersectionObserver(
      ([entry]) => setAutoScrollActive(entry.isIntersecting),
      { root: null, threshold: 0.1 }
    )
    observer.observe(container)

    container.addEventListener('mouseenter', pause)
    container.addEventListener('mouseleave', resume)
    container.addEventListener('touchstart', pause)
    container.addEventListener('touchend', resume)

    return () => {
      observer.disconnect()
      container.removeEventListener('mouseenter', pause)
      container.removeEventListener('mouseleave', resume)
      container.removeEventListener('touchstart', pause)
      container.removeEventListener('touchend', resume)
    }
  }, [pause, resume])

  useEffect(() => {
    if (!autoScrollActive) return
    const container = scrollRef.current
    if (!container) return

    const scrollStep = 320
    const handle = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth
      const atStart = container.scrollLeft <= 0
      const atEnd = container.scrollLeft >= maxScroll - 10

      if (atEnd) setDirection(-1)
      else if (atStart) setDirection(1)

      container.scrollBy({
        left: scrollStep * direction,
        behavior: 'smooth',
      })
    }, 2000)
    return () => clearInterval(handle)
  }, [autoScrollActive, direction])

  const canScrollLeft = () => (scrollRef.current?.scrollLeft ?? 0) > 0
  const canScrollRight = () => {
    const el = scrollRef.current
    return el ? el.scrollLeft < el.scrollWidth - el.clientWidth - 10 : false
  }

  return (
    <section id="promotion" className="promotion-section">
      <div className="promotion-container">
        <span className="section-title-en">PROMOTION</span>
        <h2 className="section-title-th">โปรโมชั่นพิเศษ</h2>
        <p className="promotion-description">
          โปรโมชั่นเสริมความงามราคาสุดคุ้ม สำหรับลูกค้า Caroline Clinic
        </p>
        <div className="promotion-slider-container">
          <button
            className="promotion-arrow left"
            onClick={() => scrollBy(-320)}
            aria-label="เลื่อนไปทางซ้าย"
            disabled={!canScrollLeft()}
            tabIndex={0}
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            ◀
          </button>
          <button
            className="promotion-arrow right"
            onClick={() => scrollBy(320)}
            aria-label="เลื่อนไปทางขวา"
            disabled={!canScrollRight()}
            tabIndex={0}
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            ▶
          </button>
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
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="promotion-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {limit && (
          <div>
            <a href="/promotion" className="promotion-more-button">
              ดูโปรโมชั่นทั้งหมด
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
