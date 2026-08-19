import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Lock, X } from 'lucide-react'
import type { PlataformaDetalle } from '@/lib/cms'
import { useAuth } from '@/lib/auth'
import { useContent } from '@/lib/content-context'
import { Icon } from './icon'

/** Panel lateral con el contenido de demostración de una plataforma. */
export function PlataformaPanel({
  plataforma,
  onClose,
}: {
  plataforma: PlataformaDetalle
  onClose: () => void
}) {
  const { ui: t, hero } = useContent()
  const { usuario } = useAuth()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const necesitaEntrar = plataforma.requiereSesion && !usuario

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-label={plataforma.title}>
      <button type="button" aria-label={t.cerrarMenu} onClick={onClose} className="flex-1 bg-navy-900/60 backdrop-blur-sm" />

      <aside className="flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <header className="flex items-start gap-4 border-b border-line bg-navy p-6 text-white">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white/10 text-azure-light">
            <Icon name={plataforma.icon} size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-azure-light">
              {hero.platformsLabel}
            </p>
            <h2 className="mt-1 text-lg font-bold leading-snug">{plataforma.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cerrarMenu}
            className="ml-auto rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 p-6">
          <p className="text-sm leading-relaxed text-muted">{plataforma.body}</p>

          {plataforma.caracteristicas.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {plataforma.caracteristicas.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-navy">
                  <Check size={16} className="mt-0.5 shrink-0 text-azure" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          ) : null}

          {plataforma.requiereSesion ? (
            <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-tint px-3 py-1.5 text-xs font-semibold text-muted">
              <Lock size={12} aria-hidden="true" />
              {t.portal.requiereSesion}
            </p>
          ) : null}
        </div>

        <footer className="border-t border-line p-6">
          <Link
            to={necesitaEntrar ? '/acceso' : '/portal'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
          >
            {necesitaEntrar ? t.acceso.tituloEntrar : t.portal.abrir}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </footer>
      </aside>
    </div>
  )
}
