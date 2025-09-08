// src/app/(site)/promotion/PageClient.tsx
'use client'

import './page.css'
import './pageMedia.css'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  limit?: number
}

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

export default function PromotionClient({ limit }: Props) {
  const { t } = useTranslation()

  // reveal-on-load
  const [show, setShow] = useState(false)
  useEffect(() => {
    function onLoad() {
      setShow(true)
    }
    window.addEventListener('load', onLoad)
    if (document.readyState === 'complete') onLoad()
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // slider refs/state
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScrollActive, setAutoScrollActive] = useState(false)
  const [direction, setDirection] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pause = useCallback(() => setAutoScrollActive(false), [])
  const resume = useCallback(() => setAutoScrollActive(true), [])

  // Cloudinary state
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchList = useCallback(async (cursor?: string | null) => {
    try {
      const url = cursor
        ? `/api/cloudinary/promotion/list?next=${encodeURIComponent(cursor)}`
        : '/api/cloudinary/promotion/list'
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load images')
      const data = await res.json()
      if (!cursor) setImages(data.resources)
      else setImages((prev) => [...prev, ...data.resources])
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

  // visible list (respect limit)
  const visiblePromotions = limit ? images.slice(0, limit) : images

  // arrow disable state
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(visiblePromotions.length <= 1)

  const checkArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 16)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 16)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkArrows()
    el.addEventListener('scroll', checkArrows)
    return () => el.removeEventListener('scroll', checkArrows)
  }, [visiblePromotions.length, checkArrows, show])

  const scrollBy = useCallback((amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])

  // start/stop auto scroll when slider is in view
  useEffect(() => {
    if (!show) return
    const container = scrollRef.current
    if (!container) return
    const observer = new window.IntersectionObserver(
      ([entry]) => setAutoScrollActive(entry.isIntersecting),
      { root: null, threshold: 0.1 }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [show])

  // auto scroll
  useEffect(() => {
    if (!show || !autoScrollActive) return
    const container = scrollRef.current
    if (!container) return

    const scrollStep = isMobile ? 320 : 640
    const handle = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth
      const atStartLocal = container.scrollLeft <= 16
      const atEndLocal = container.scrollLeft >= maxScroll - 16

      setDirection((dir) => {
        if (atEndLocal) return -1
        if (atStartLocal) return 1
        return dir
      })

      container.scrollBy({
        left: scrollStep * direction,
        behavior: 'smooth',
      })
    }, 2000)
    return () => clearInterval(handle)
  }, [show, autoScrollActive, direction, isMobile])

  return (
    <section id="promotion" className="promotion-section">
      <div className="promotion-container">
        <span className="section-title-en">PROMOTION</span>
        <h2 className="section-title-th">{t(`promotions.headline`)}</h2>
        <p className="promotion-description">{t(`promotions.desc`)}</p>

        {/* States */}
        {loading ? (
          <div className="admin-about-loading" style={{ textAlign: 'center' }}>
            Loading...
          </div>
        ) : error ? (
          <div className="admin-about-error" style={{ textAlign: 'center' }}>
            {error}
          </div>
        ) : visiblePromotions.length === 0 ? (
          <div className="admin-about-empty" style={{ textAlign: 'center' }}>
            No promotion images found.
          </div>
        ) : (
          <div
            className="promotion-slider-container"
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <button
              className="promotion-arrow left"
              onClick={() => scrollBy(isMobile ? -320 : -640)}
              aria-label="เลื่อนไปทางซ้าย"
              disabled={atStart}
              tabIndex={0}
            >
              ◀
            </button>
            <button
              className="promotion-arrow right"
              onClick={() => scrollBy(isMobile ? 320 : 640)}
              aria-label="เลื่อนไปทางขวา"
              disabled={atEnd}
              tabIndex={0}
            >
              ▶
            </button>

            {show && (
              <div className="promotion-slider-wrapper" ref={scrollRef}>
                <div className="promotion-list">
                  {visiblePromotions.map((img, index) => {
                    const transformed = img.secure_url.replace(
                      '/upload/',
                      '/upload/f_auto,q_auto/'
                    )
                    return (
                      <div
                        key={img.asset_id ?? `${img.public_id}-${index}`}
                        className="promotion-card snap-start"
                      >
                        <div
                          className="promotion-image-wrapper"
                          onTouchStart={pause}
                          onTouchEnd={resume}
                          onTouchCancel={resume}
                        >
                          <Image
                            src={transformed}
                            alt={img.public_id || `Promotion ${index + 1}`}
                            width={375}
                            height={450}
                            className="promotion-image"
                            loading={limit ? 'eager' : 'lazy'}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Optional: load more if there are additional pages and no limit */}
        {!limit && nextCursor && !loading && !error && (
          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <button
              className="promotion-more-button"
              onClick={() => fetchList(nextCursor)}
            >
              Load more
            </button>
          </div>
        )}

        {/* Link to full page when used as a limited section */}
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
