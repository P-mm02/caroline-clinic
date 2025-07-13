// src/lib/slowScrollBy.ts

/**
 * Smoothly scrolls the container horizontally or vertically over a custom duration.
 * 
 * @param container - The HTML element to scroll.
 * @param options - left (pixels), top (pixels), duration (ms).
 */
export function slowScrollBy(
  container: HTMLElement,
  options: { left?: number; top?: number; duration?: number }
) {
  const { left = 0, top = 0, duration = 2000 } = options;

  const startLeft = container.scrollLeft;
  const startTop = container.scrollTop;
  const endLeft = startLeft + left;
  const endTop = startTop + top;
  const deltaLeft = endLeft - startLeft;
  const deltaTop = endTop - startTop;
  const startTime = performance.now();

  function animateScroll(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1); // [0,1]

    // Ease in-out (optional: comment this out for linear motion)
    const ease = 0.5 - 0.5 * Math.cos(Math.PI * progress);

    container.scrollLeft = startLeft + deltaLeft * ease;
    container.scrollTop = startTop + deltaTop * ease;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
