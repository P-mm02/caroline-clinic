'use client'

import './page.css'
import './pageMedia.css'
import Image from 'next/image'
import promotions from './data.json'
import { useEffect, useRef, useState } from 'react'

type Props = {
  limit?: number
}

export default function PromotionClient({ limit }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const direction = useRef(1)
  const [visible, setVisible] = useState(true)

  const startAutoScroll = () => {
    if (!scrollRef.current || intervalRef.current || !visible) return

    intervalRef.current = setInterval(() => {
      const container = scrollRef.current!
      const maxScroll = container.scrollWidth - container.clientWidth
      const atStart = container.scrollLeft <= 0
      const atEnd = container.scrollLeft >= maxScroll - 10

      if (atEnd) direction.current = -1
      else if (atStart) direction.current = 1

      container.scrollBy({
        left: 320 * direction.current,
        behavior: 'smooth',
      })
    }, 2000)
  }

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setVisible(isVisible)
        if (isVisible) startAutoScroll()
        else stopAutoScroll()
      },
      { root: null, threshold: 0.1 }
    )

    observer.observe(container)

    container.addEventListener('mouseenter', stopAutoScroll)
    container.addEventListener('mouseleave', startAutoScroll)
    container.addEventListener('touchstart', stopAutoScroll)
    container.addEventListener('touchend', startAutoScroll)

    return () => {
      stopAutoScroll()
      observer.disconnect()
      container.removeEventListener('mouseenter', stopAutoScroll)
      container.removeEventListener('mouseleave', startAutoScroll)
      container.removeEventListener('touchstart', stopAutoScroll)
      container.removeEventListener('touchend', startAutoScroll)
    }
  }, [visible])

  const visiblePromotions = limit ? promotions.slice(0, limit) : promotions

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
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
            }
          >
            ◀
          </button>
          <button
            className="promotion-arrow right"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
            }
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
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="promotion-image"
                    />
                  </div>
                  <div className="promotion-info">
                    <h3>{promo.title}</h3>
                    <p>{promo.description}</p>
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
