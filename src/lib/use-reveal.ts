import { useEffect, useRef, useState } from 'react'

/**
 * Adds an on-scroll entrance animation. Returns a ref for the element and the
 * className to spread on it. Honours prefers-reduced-motion via CSS.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return {
    ref,
    className: shown ? 'reveal reveal-in' : 'reveal',
    style: { transitionDelay: `${delay}ms` },
  }
}
