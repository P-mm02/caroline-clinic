// src/app/(site)/review/PageClient.tsx
'use client'

import './page.css'
import './pageMedia.css'
import '@/styles/apearFrom.css'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import appearFromBottom from '@/lib/appearFrom/bottom' // options version
import { useTranslation } from 'react-i18next'

type Props = { limit?: number }

type CloudinaryImage = {
  asset_id: string
  public_id: string
  format: string
  width: number
  height: number
  bytes: number
  secure_url: string
  created_at: string
}

export default function ReviewClient({ limit }: Props) {
  const { t } = useTranslation()

  // Refs for appear-from-bottom
  const fromBottomRefsDiv = useRef<Array<HTMLDivElement | null>>([])

  // Reveal-on-load toggle
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onLoad = () => setShow(true)
    window.addEventListener('load', onLoad)
    if (document.readyState === 'complete') onLoad()
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // Cloudinary state
  const [reviewImages, setReviewImages] = useState<CloudinaryImage[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch list (paginated)
  const fetchList = useCallback(async (cursor?: string | null) => {
    try {
      const url = cursor
        ? `/api/cloudinary/review/list?next=${encodeURIComponent(cursor)}`
        : '/api/cloudinary/review/list'
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load images')
      const data = await res.json()

      if (!cursor) setReviewImages(data.resources)
      else setReviewImages((prev) => [...prev, ...data.resources])

      setNextCursor(data.next_cursor ?? null)
      setError('')
    } catch (e) {
      console.error(e)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  // Visible list (respect limit)
  const visibleReviews = limit ? reviewImages.slice(0, limit) : reviewImages

  // IMPORTANT: call the hook at top level and depend on changes
  appearFromBottom(fromBottomRefsDiv.current, {
    className: 'show',
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
    once: true,
    deps: [visibleReviews.length, show], // re-run when count or 'show' changes
  })

  return (
    <section id="review" className="review-section">
      <div className="review-container">
        <span className="section-title-en">REVIEWS</span>
        <h2 className="review-title">{t(`reviews.headline`)}</h2>
        <p className="review-description">{t(`reviews.desc`)}</p>

        {/* Loading / Error states */}
        {loading ? (
          <div className="admin-about-loading" style={{ textAlign: 'center' }}>
            Loading...
          </div>
        ) : error ? (
          <div className="admin-about-error" style={{ textAlign: 'center' }}>
            {error}
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="admin-about-empty" style={{ textAlign: 'center' }}>
            No review images found.
          </div>
        ) : (
          show && (
            <div className="review-grid-container">
              {visibleReviews.map((img, index) => {
                const transformed = img.secure_url.replace(
                  '/upload/',
                  '/upload/f_auto,q_auto/'
                )
                return (
                  <div
                    key={img.asset_id ?? `${img.public_id}-${index}`}
                    className="review-card appear-from-bottom"
                    ref={(el) => {
                      fromBottomRefsDiv.current[index] = el
                    }}
                  >
                    <div className="review-image-wrapper">
                      <Image
                        src={transformed}
                        alt={`รีวิว ${index + 1}`}
                        width={300}
                        height={375}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="review-image"
                        loading={limit ? 'eager' : 'lazy'}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Pagination (only when no limit && more pages) */}
        {!limit && nextCursor && !loading && !error && (
          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <button
              className="review-more-button"
              onClick={() => fetchList(nextCursor)}
            >
              Load more
            </button>
          </div>
        )}

        {/* Link to full page when used as a limited section */}
        {limit && (
          <div>
            <a href="/review" className="review-more-button">
              {t(`reviews.all`)}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
