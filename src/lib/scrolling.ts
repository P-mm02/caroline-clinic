// src/lib/scrolling.ts
export function startContinuousScroll(
  container: HTMLDivElement,
  speed = 0.5
): () => void {
  let animationId: number

  const step = () => {
    if (!container) return
    container.scrollLeft += speed

    const maxScroll = container.scrollWidth - container.clientWidth
    if (container.scrollLeft >= maxScroll) {
      container.scrollLeft = 0
    }

    animationId = requestAnimationFrame(step)
  }

  animationId = requestAnimationFrame(step)
  return () => cancelAnimationFrame(animationId)
}
