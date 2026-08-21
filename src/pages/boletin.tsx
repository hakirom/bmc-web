import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { BmcLogo } from '@/components/bmc-logo'
import { Bloques, type Bloque } from '@/components/bloques'
import { SiteFooter } from '@/components/site-footer'
import { fetchBoletin, type BoletinCms } from '@/lib/cms'
import { useContent } from '@/lib/content-context'

export function BoletinPage() {
  const { slug = '' } = useParams()
  const { ui: t, locale, boletinesSection } = useContent()

  const [boletin, setBoletin] = useState<BoletinCms | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const controlador = new AbortController()
    setCargando(true)

    fetchBoletin(slug, locale, controlador.signal)
      .then(setBoletin)
      .catch(() => setBoletin(null))
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })

    return () => controlador.abort()
  }, [slug, locale])

  const fechaLarga = new Intl.DateTimeFormat(t.intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-navy">
        <div className="container-page flex h-[70px] items-center gap-4">
          <Link to="/" aria-label={t.irAlInicio}>
            <BmcLogo dark />
          </Link>
          <Link
            to="/#boletines"
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-white/40 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            {boletinesSection.eyebrow}
          </Link>
        </div>
      </header>

      <main className="container-page max-w-3xl py-12">
        {cargando ? (
          <p className="flex items-center gap-2 text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            {t.consultandoCms}
          </p>
        ) : !boletin ? (
          <div className="rounded-lg border border-dashed border-line p-10 text-center">
            <p className="text-muted">404 — {slug}</p>
            <Link to="/#boletines" className="mt-4 inline-block font-semibold text-azure hover:underline">
              {boletinesSection.eyebrow}
            </Link>
          </div>
        ) : (
          <article>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-tint px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-600">
                {t.categorias[boletin.categoria] ?? boletin.categoria}
              </span>
              {boletin.destacado ? (
                <span className="rounded-full bg-azure px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {t.destacado}
                </span>
              ) : null}
              {boletin.redactadoPor && boletin.redactadoPor !== 'manual' ? (
                <span
                  title="Borrador redactado por el asistente y revisado por el equipo editorial"
                  className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted"
                >
                  <Sparkles size={11} aria-hidden="true" />
                  Redacción asistida
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-bold leading-tight text-heading">
              {boletin.titulo}
            </h1>

            <time dateTime={boletin.fecha} className="mt-3 block text-sm text-muted">
              {fechaLarga.format(new Date(`${boletin.fecha}T12:00:00`))}
            </time>

            <p className="mt-6 border-l-4 border-azure pl-4 text-lg leading-relaxed text-muted">
              {boletin.resumen}
            </p>

            <div className="mt-8">
              {Array.isArray(boletin.contenido) && boletin.contenido.length > 0 ? (
                <Bloques bloques={boletin.contenido as Bloque[]} />
              ) : (
                <p className="text-muted">{boletin.resumen}</p>
              )}
            </div>
          </article>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
