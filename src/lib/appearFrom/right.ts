import { useEffect } from 'react'

export default function appearFromRight<T extends HTMLElement>(
  refs: Array<T | null>,
  className: string = 'show',
  threshold: number = 0.15
) {
  useEffect(() => {
    if (!refs?.length) return
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className)
          }
        })
      },
      { threshold }
    )
    refs.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
    // Don't include "refs" in the dependency array!
  }, [className, threshold])
}
