import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContent } from '@/lib/content-context'
import { Icon } from './icon'
import { PlataformaPanel } from './plataforma-detalle'

/** Tarjetas visibles a la vez según el ancho de pantalla. */
function useVisibleCount() {
  const [visible, setVisible] = useState(3)

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      setVisible(w >= 1024 ? 3 : w >= 640 ? 2 : 1)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  return visible
}

export function Hero() {
  const { hero, ui: t, plataformas } = useContent()
  const [detalle, setDetalle] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const visible = useVisibleCount()
  const total = hero.platforms.length
  const maxIndex = Math.max(0, total - visible)

  // Al cambiar de breakpoint el índice puede quedar fuera de rango.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), 5000)
    return () => window.clearInterval(id)
  }, [paused, maxIndex])

  const go = (dir: -1 | 1) =>
    setIndex((i) => {
      const next = i + dir
      if (next < 0) return maxIndex
      if (next > maxIndex) return 0
      return next
    })

  return (
    <section id="top" className="hero-mesh relative overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-page relative py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-azure-light">{hero.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px]">
          {hero.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
          {hero.subtitle}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-tint"
          >
            {hero.ctaPrimary}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <Link
            to="/acceso"
            className="inline-flex items-center gap-2 rounded-md border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {hero.ctaSecondary}
          </Link>
        </div>

        <div
          className="mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          aria-roledescription="carrusel"
          aria-label={hero.platformsLabel}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
              {hero.platformsLabel}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t.plataformaAnterior}
                className="rounded-full border border-white/35 p-2 text-white transition-colors hover:bg-white hover:text-navy"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t.plataformaSiguiente}
                className="rounded-full border border-white/35 p-2 text-white transition-colors hover:bg-white hover:text-navy"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden">
            <ul
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
            >
              {hero.platforms.map((platform, i) => (
                <li
                  key={platform.title}
                  className="w-full shrink-0 pr-4 sm:w-1/2 lg:w-1/3"
                  aria-hidden={i < index || i >= index + visible}
                >
                  <article className="flex h-full flex-col rounded-lg border border-white/15 bg-white/[0.07] p-6 backdrop-blur-sm transition-colors hover:border-azure-light/70 hover:bg-white/[0.12]">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-azure/25 text-azure-light">
                      <Icon name={platform.icon} />
                    </span>
                    <h3 className="mt-4 text-base font-bold leading-snug text-white">{platform.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{platform.body}</p>
                    <button
                      type="button"
                      onClick={() => setDetalle(platform.title)}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-azure-light hover:underline"
                    >
                      {t.conocerMas}
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver grupo de plataformas ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-8 bg-white' : 'w-3 bg-white/35 hover:bg-white/60',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {detalle ? (
        (() => {
          const seleccionada = plataformas.find((p) => p.title === detalle)
          return seleccionada ? (
            <PlataformaPanel plataforma={seleccionada} onClose={() => setDetalle(null)} />
          ) : null
        })()
      ) : null}
    </section>
  )
}
