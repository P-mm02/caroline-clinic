// src/app/(site)/about/PageClient.tsx
'use client'

import './page.css'
import '@/styles/apearFrom.css'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function AboutClient() {
  const { t } = useTranslation()

  // --- reveal-on-load toggle (keep) ---
  const [show, setShow] = useState(false)
  useEffect(() => {
    function onLoad() {
      setShow(true)
    }
    window.addEventListener('load', onLoad)
    if (document.readyState === 'complete') onLoad()
    return () => window.removeEventListener('load', onLoad)
  }, [])

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

  const scrollRef = useRef<HTMLDivElement>(null)

  // --- Cloudinary types & state ---
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

  const [aboutImages, setAboutImages] = useState<CloudinaryImage[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // ---- Fetch list ----
  async function fetchList(cursor?: string | null) {
    try {
      const url = cursor
        ? `/api/cloudinary/about/list?next=${encodeURIComponent(cursor)}`
        : '/api/cloudinary/about/list'
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load images')
      const data = await res.json()
      if (!cursor) {
        setAboutImages(data.resources)
      } else {
        setAboutImages((prev) => [...prev, ...data.resources])
      }
      setNextCursor(data.next_cursor ?? null)
      setError('')
    } catch (e) {
      console.error(e)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  // initial fetch
  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // State-driven arrow disables
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false) // start false to avoid disabling right arrow on mount

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
  }, [aboutImages.length, checkArrows, show]) // keep show as dependency

  // --- Auto scroll logic ---
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

  const scrollBy = useCallback((amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])
  const handlePrev = () => scrollBy(isMobile ? -320 : -640)
  const handleNext = () => scrollBy(isMobile ? 320 : 640)

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          {/* Left: Text */}
          <div className="about-text">
            <span className="section-title-en">ABOUT US</span>
            <h2 className="section-title-th">{t(`about.headline`)}</h2>
            <p className="about-description">{t(`about.description`)}</p>
            <p className="about-description">{t(`about.description2`)}</p>
          </div>

          {/* Right: Images slider */}
          <div className="about-image-wrapper">
            <div
              className="about-slider-container"
              onMouseEnter={pause}
              onMouseLeave={resume}
            >
              <button
                className="about-slider-arrow left"
                onClick={handlePrev}
                disabled={atStart}
                aria-label="Previous image"
              >
                ◀
              </button>

              {show && (
                <div className="about-slider-track" ref={scrollRef}>
                  {aboutImages.map((img, idx) => (
                    <div
                      className="about-slider-img-wrapper"
                      key={img.asset_id} // use a stable unique key
                      onTouchStart={pause}
                      onTouchEnd={resume}
                      onTouchCancel={resume}
                    >
                      <Image
                        src={img.secure_url} // use actual URL
                        alt={`About Image ${idx + 1}`}
                        width={600}
                        height={1200}
                        className="about-image"
                        loading="eager" // keep eager as requested
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                className="about-slider-arrow right"
                onClick={handleNext}
                disabled={atEnd}
                aria-label="Next image"
              >
                ▶
              </button>
            </div>

            {/* (Optional) Load more button if you want to paginate manually */}
            {nextCursor && !loading && !error && (
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button onClick={() => fetchList(nextCursor)}>Load more</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
