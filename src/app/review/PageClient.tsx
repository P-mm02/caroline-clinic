'use client'

import './page.css'
import './pageMedia.css'
import Image from 'next/image'
import reviews from './data.json'
import { useEffect, useRef, useState } from 'react'

type Props = {
  limit?: number
}

export default function ReviewClient({ limit }: Props) {
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

    // Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setVisible(isVisible)
        if (isVisible) startAutoScroll()
        else stopAutoScroll()
      },
      {
        root: null,
        threshold: 0.1, // 10% visible = trigger
      }
    )

    observer.observe(container)

    // Pause/resume on hover/touch
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

  const visibleReviews = limit ? reviews.slice(0, limit) : reviews

  return (
    <section id="review" className="review-section">
      <div className="review-container">
        <span className="section-title-en">REVIEWS</span>
        <h2 className="review-title">รีวิวจากลูกค้า</h2>
        <p className="review-description">
          เสียงตอบรับจากลูกค้าผู้ใช้บริการจริงที่ Caroline Clinic
        </p>
        <div className="review-slider-container">
          <button
            className="review-arrow left"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
            }
          >
            ◀
          </button>
          <button
            className="review-arrow right"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
            }
          >
            ▶
          </button>
          <div className="review-slider-wrapper" ref={scrollRef}>
            <div className="review-list">
              {visibleReviews.map((review, index) => (
                <div key={index} className="review-card snap-start">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <Image
                      src={review.profile}
                      alt={`รีวิวโดย ${review.name}`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div style={{ textAlign: 'left' }}>
                      <p className="review-name">{review.name}</p>
                      <p style={{ color: '#777', fontSize: '0.9rem' }}>
                        {review.location}
                      </p>
                    </div>
                  </div>

                  <p className="review-text">{review.text}</p>

                  <div
                    className="review-image-wrapper"
                    style={{ marginTop: '1.5rem' }}
                  >
                    <Image
                      src={review.photo}
                      alt={`ภาพรีวิวจาก ${review.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="review-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {limit && (
          <div>
            <a href="/review" className="review-more-button">
              ดูรีวิวทั้งหมด
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
