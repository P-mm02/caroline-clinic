'use client'

import './page.css'
import '@/styles/apearFrom.css'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function AboutClient() {
  const { t } = useTranslation()

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

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pause = useCallback(() => setAutoScrollActive(false), [])
  const resume = useCallback(() => setAutoScrollActive(true), [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const aboutImages = [
    '/images/about/S__4956722_0.jpg',
    '/images/about/S__4956721_0.jpg',
    '/images/about/S__4956720_0.jpg',
    '/images/about/S__4956719_0.jpg',
    '/images/about/S__4956717_0.jpg',
  ]

  // Arrow disable logic based on scroll position
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(aboutImages.length <= 1)
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
  }, [aboutImages.length, checkArrows])

  // Auto scroll logic (optional)
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
      const atStart = container.scrollLeft <= 16
      const atEnd = container.scrollLeft >= maxScroll - 16

      setDirection((dir) => {
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
              <div className="about-slider-track" ref={scrollRef}>
                {aboutImages.map((img, idx) => (
                  <div
                    className="about-slider-img-wrapper"
                    key={img}
                    onTouchStart={pause}
                    onTouchEnd={resume}
                    onTouchCancel={resume}
                  >
                    <Image
                      src={img}
                      alt={`About Image ${idx + 1}`}
                      width={600}
                      height={1200}
                      className="about-image"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AHZycdDLxM3U5gB0WgDAu6kaEgAATi0AmZSBBBknAGZWJfv56bbL3GdGEeZikxwvAAAAAElFTkSuQmCC"
                    />
                  </div>
                ))}
              </div>
              <button
                className="about-slider-arrow right"
                onClick={handleNext}
                disabled={atEnd}
                aria-label="Next image"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
