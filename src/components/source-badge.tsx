import { Database, HardDrive, Loader2 } from 'lucide-react'
import { CMS_URL } from '@/lib/cms'
import { useContent } from '@/lib/content-context'

/** Indica de dónde salen los datos: útil para demostrar el CMS en vivo. */
export function SourceBadge() {
  const { source, loading, error } = useContent()

  if (loading) {
    return (
      <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-muted shadow-lg">
        <Loader2 size={13} className="animate-spin" aria-hidden="true" />
        Consultando el CMS…
      </span>
    )
  }

  if (source === 'cms') {
    return (
      <a
        href={`${CMS_URL}/admin`}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-900 shadow-lg transition-colors hover:bg-emerald-100"
      >
        <Database size={13} aria-hidden="true" />
        Contenido servido por Strapi
      </a>
    )
  }

  return (
    <span
      title={error ?? undefined}
      className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 shadow-lg"
    >
      <HardDrive size={13} aria-hidden="true" />
      CMS no disponible — contenido local
    </span>
  )
}
