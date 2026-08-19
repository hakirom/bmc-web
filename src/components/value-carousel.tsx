import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContent } from '@/lib/content-context'
import { SectionHeading } from './section-heading'

export function ValueCarousel() {
  const { valueSection, ui: t } = useContent()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = valueSection.slides.length

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), 6000)
    return () => window.clearInterval(id)
  }, [paused, total])

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + total) % total)

  return (
    <section
      className="border-b border-line bg-white py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label={valueSection.eyebrow}
    >
      <div className="container-page">
        <SectionHeading eyebrow={valueSection.eyebrow} align="center" />

        <div className="mx-auto mt-10 max-w-4xl">
          <Quote size={40} className="mx-auto text-azure/25" fill="currentColor" aria-hidden="true" />

          {/* Todas las diapositivas comparten celda de grid: la altura la marca la más alta. */}
          <div className="mt-4 grid">
            {valueSection.slides.map((slide, i) => (
              <p
                key={slide}
                aria-hidden={i !== index}
                className={cn(
                  'col-start-1 row-start-1 text-balance text-center text-lg leading-relaxed text-navy transition-opacity duration-500 sm:text-xl',
                  i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                {slide}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.anterior}
              className="rounded-full border border-line p-2 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            <div className="flex gap-2">
              {valueSection.slides.map((slide, i) => (
                <button
                  key={slide}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ir al mensaje ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === index ? 'w-8 bg-navy' : 'w-2 bg-line hover:bg-muted',
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.siguiente}
              className="rounded-full border border-line p-2 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
