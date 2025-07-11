'use client'

import './page.css'
import './pageMedia.css'
import Image from 'next/image'
import reviews from './data.json'

type Props = {
  limit?: number
}

export default function ReviewClient({ limit }: Props) {
  const visibleReviews = limit ? reviews.slice(0, limit) : reviews

  return (
    <section id="review" className="review-section">
      <div className="review-container">
        <span className="section-title-en">REVIEWS</span>
        <h2 className="review-title">รีวิวจากลูกค้า</h2>
        <p className="review-description">
          เสียงตอบรับจากลูกค้าผู้ใช้บริการจริงที่ Caroline Clinic
        </p>
        <div className="review-grid-container">
          {visibleReviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-image-wrapper">
                <Image
                  src={review.image}
                  alt={`รีวิว ${index + 1}`}
                  width={300}
                  height={375}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="review-image"
                />
              </div>
            </div>
          ))}
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
