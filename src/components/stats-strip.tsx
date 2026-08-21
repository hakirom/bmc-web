import { ArrowUpRight, Maximize2, RefreshCw } from 'lucide-react'
import { useContent } from '@/lib/content-context'
import { useReveal } from '@/lib/use-reveal'
import { EnlaceUi } from './enlace-ui'

/**
 * Panel de indicadores presentado como un informe embebido.
 *
 * Simula la integración de un tablero de Power BI: marco propio, barra de
 * herramientas, sello de origen y marca de actualización. Los datos son los del
 * CMS, no hay ninguna llamada externa; el día que se conecte el informe real
 * bastará con sustituir el contenido del marco por el iframe correspondiente.
 */
export function StatsStrip() {
  const { stats, panelIndicadores: panel, ui: t } = useContent()
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section className="bg-navy py-16" aria-label={t.seccionCifras}>
      <div ref={reveal.ref} style={reveal.style} className={`${reveal.className} container-page`}>
        <figure className="overflow-hidden rounded-lg border border-line-dark bg-navy-800 shadow-2xl shadow-black/30">
          {/* Barra del informe */}
          <figcaption className="flex flex-wrap items-center gap-3 border-b border-line-dark bg-navy-900 px-5 py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-[#f2c811] text-[11px] font-bold text-[#1a1a1a]">
              BI
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{panel.titulo}</p>
              {panel.descripcion ? (
                <p className="truncate text-xs text-white/55">{panel.descripcion}</p>
              ) : null}
            </div>

            <div className="ml-auto flex items-center gap-3 text-xs text-white/55">
              {panel.actualizado ? (
                <span className="hidden items-center gap-1.5 sm:inline-flex">
                  <RefreshCw size={12} aria-hidden="true" />
                  {panel.actualizado}
                </span>
              ) : null}
              <span className="rounded border border-white/15 px-2 py-1 font-medium text-white/70">
                {panel.fuente}
              </span>
              <Maximize2 size={14} aria-hidden="true" className="hidden sm:block" />
            </div>
          </figcaption>

          {/* Lienzo del informe */}
          <div className="grid gap-px bg-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="bg-navy-800 px-5 py-6">
                <p className="text-3xl font-bold tabular-nums text-white lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm leading-snug text-white/70">{stat.label}</p>

                {/* Barra de progreso: da lectura visual al indicador */}
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
                  role="img"
                  aria-label={`${stat.label}: ${stat.progreso} de 100`}
                >
                  <span
                    className="block h-full rounded-full bg-azure-light transition-[width] duration-700"
                    style={{ width: `${Math.min(100, Math.max(0, stat.progreso))}%` }}
                  />
                </div>

                {stat.tendencia ? (
                  <p className="mt-2 text-xs font-medium text-azure-light">{stat.tendencia}</p>
                ) : null}
              </article>
            ))}
          </div>

          {panel.enlace ? (
            <div className="border-t border-line-dark bg-navy-900 px-5 py-3 text-right">
              <EnlaceUi
                url={panel.enlace.url}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-azure-light hover:underline"
              >
                {panel.enlace.label}
                <ArrowUpRight size={14} aria-hidden="true" />
              </EnlaceUi>
            </div>
          ) : null}
        </figure>

        <p className="mt-3 text-center text-xs text-white/40">
          {panel.fuente} · {t.avisoDemo}
        </p>
      </div>
    </section>
  )
}
