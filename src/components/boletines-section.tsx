import { ArrowRight, FileText } from 'lucide-react'
import { useContent } from '@/lib/content-context'
import { useReveal } from '@/lib/use-reveal'
import { SectionHeading } from './section-heading'

const etiquetas: Record<string, string> = {
  'boletin-diario': 'Boletín diario',
  'estudio-economico': 'Estudio económico',
  comunicado: 'Comunicado',
}

const fechaLarga = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

/** Se alimenta de la colección Boletín de Strapi; si el CMS no responde, no se renderiza. */
export function BoletinesSection() {
  const { boletines } = useContent()
  const reveal = useReveal<HTMLDivElement>()

  if (boletines.length === 0) return null

  return (
    <section id="boletines" className="border-b border-line bg-white py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Boletines del mercado"
          title="Información y análisis para decidir a tiempo"
        />

        <div
          ref={reveal.ref}
          style={reveal.style}
          className={`${reveal.className} mt-12 grid gap-5 md:grid-cols-3`}
        >
          {boletines.map((boletin) => (
            <article
              key={boletin.documentId}
              className="flex h-full flex-col rounded-lg border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-azure/50 hover:shadow-[0_20px_45px_-30px_rgba(1,51,101,0.6)]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-tint text-navy">
                  <FileText size={17} aria-hidden="true" />
                </span>
                <span className="rounded-full bg-tint px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-600">
                  {etiquetas[boletin.categoria] ?? boletin.categoria}
                </span>
                {boletin.destacado ? (
                  <span className="rounded-full bg-azure px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Destacado
                  </span>
                ) : null}
              </div>

              <time dateTime={boletin.fecha} className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
                {fechaLarga.format(new Date(`${boletin.fecha}T12:00:00`))}
              </time>
              <h3 className="mt-2 text-base font-bold leading-snug text-navy">{boletin.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{boletin.resumen}</p>

              <a
                href="#"
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-azure hover:underline"
              >
                Leer boletín
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
