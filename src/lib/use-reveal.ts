import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Animación de entrada al hacer scroll.
 *
 * Dos decisiones importantes, ambas por errores reales:
 *
 * 1. Se usa un *callback ref* y no `useRef` + efecto. Un componente que primero
 *    devuelve `null` —porque sus datos aún no llegan— monta su nodo más tarde,
 *    y con un efecto de dependencias vacías el observador nunca se enganchaba:
 *    el bloque se quedaba en `opacity: 0`, presente en el DOM pero invisible.
 *
 * 2. La animación nunca puede ocultar contenido de forma permanente. Si el
 *    elemento ya está a la vista al montarse, si la pestaña está en segundo
 *    plano o si el navegador no soporta IntersectionObserver, se muestra sin
 *    más. Es preferible perder la animación que perder el contenido.
 *
 * `prefers-reduced-motion` se respeta desde el CSS.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const [shown, setShown] = useState(false)
  const observador = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    observador.current?.disconnect()
    if (!node) return

    const sinObservador = typeof IntersectionObserver === 'undefined'
    const pestanaOculta = typeof document !== 'undefined' && document.visibilityState === 'hidden'

    // Ya visible al montarse: no hay nada que esperar.
    const caja = node.getBoundingClientRect()
    const yaALaVista = caja.top < window.innerHeight && caja.bottom > 0

    if (sinObservador || pestanaOculta || yaALaVista) {
      setShown(true)
      return
    }

    observador.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observador.current?.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observador.current.observe(node)
  }, [])

  useEffect(() => () => observador.current?.disconnect(), [])

  return {
    ref,
    className: shown ? 'reveal reveal-in' : 'reveal',
    style: { transitionDelay: `${delay}ms` },
  }
}
