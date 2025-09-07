// src/lib/appearFrom/bottom.ts
import { useEffect } from 'react'

type Options = {
  className?: string
  threshold?: number
  rootMargin?: string
  once?: boolean
  /** extra dependencies from the caller (e.g., visibleReviews.length, show) */
  deps?: any[]
}

/**
 * Observe a list of HTMLElements and add `className` when they enter the viewport.
 * Must be called at the top level of a React component (uses useEffect).
 */
export default function appearFromBottom<T extends HTMLElement>(
  refs: Array<T | null>,
  {
    className = 'show',
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    once = true,
    deps = [],
  }: Options = {}
) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const els = refs.filter((el): el is T => !!el)
    if (els.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            el.classList.add(className)
            if (once) io.unobserve(el)
          } else if (!once) {
            el.classList.remove(className)
          }
        }
      },
      { threshold, rootMargin }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // Re-run when options change, the number of refs changes, or caller-specified deps change
  }, [className, threshold, rootMargin, once, refs.length, ...deps])
}
