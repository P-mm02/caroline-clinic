'use client'

import './page.css'
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

        <div className="review-list">
          {visibleReviews.map((review, index) => (
            <div key={index} className="review-card">
              {/* Profile info */}
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

              {/* Review text */}
              <p className="review-text">{review.text}</p>

              {/* Review photo */}
              <div style={{ marginTop: '1.5rem' }}>
                <Image
                  src={review.photo}
                  alt={`ภาพรีวิวจาก ${review.name}`}
                  width={600}
                  height={400}
                  className="review-photo"
                />
              </div>
            </div>
          ))}
        </div>
        {limit && (
          <div style={{ marginTop: '2rem' }}>
            <a href="/review" className="review-more-button">
              ดูรีวิวทั้งหมด
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
