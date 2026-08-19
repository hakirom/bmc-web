import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LogOut, Lock } from 'lucide-react'
import { BmcLogo } from '@/components/bmc-logo'
import { Icon } from '@/components/icon'
import { useAuth } from '@/lib/auth'
import { useContent } from '@/lib/content-context'
import type { ComponentePortal } from '@/lib/cms'

/** Widget con datos reales para los componentes que los tienen. */
function Datos({ componente }: { componente: ComponentePortal }) {
  const { marketBoard, boletines } = useContent()

  if (componente.tipo === 'operaciones') {
    return (
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {marketBoard.summary.map((item) => (
          <div key={item.label} className="rounded border border-line bg-tint px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-muted">{item.label}</dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums text-navy">{item.value}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (componente.tipo === 'boletines') {
    return (
      <ul className="mt-4 space-y-2">
        {boletines.slice(0, 3).map((b) => (
          <li key={b.documentId} className="rounded border border-line bg-tint px-3 py-2 text-sm text-navy">
            {b.titulo}
          </li>
        ))}
      </ul>
    )
  }

  if (componente.tipo === 'tramites') {
    return (
      <ul className="mt-4 space-y-2 text-sm">
        {[
          { id: 'REG-2026-0184', estado: 'En trámite' },
          { id: 'REG-2026-0177', estado: 'Aprobado' },
        ].map((tramite) => (
          <li key={tramite.id} className="flex items-center justify-between rounded border border-line bg-tint px-3 py-2">
            <span className="font-mono text-[13px] text-muted">{tramite.id}</span>
            <span className="font-semibold text-navy">{tramite.estado}</span>
          </li>
        ))}
      </ul>
    )
  }

  return null
}

function Tarjeta({ componente, bloqueado }: { componente: ComponentePortal; bloqueado: boolean }) {
  const { ui: t } = useContent()

  return (
    <article
      className={`flex h-full flex-col rounded-lg border border-line bg-white p-6 transition-all duration-300 ${
        bloqueado ? 'opacity-70' : 'hover:-translate-y-1 hover:border-azure/50 hover:shadow-[0_20px_45px_-30px_rgba(1,51,101,0.6)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-tint text-navy">
          <Icon name={componente.icono} size={22} />
        </span>
        {bloqueado ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-tint px-2.5 py-1 text-[11px] font-semibold text-muted">
            <Lock size={11} aria-hidden="true" />
            {t.portal.requiereSesion}
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 text-lg font-bold text-navy">{componente.titulo}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{componente.descripcion}</p>

      {!bloqueado ? <Datos componente={componente} /> : null}

      {componente.tipo === 'soporte' ? (
        <Link
          to="/pqrsf"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-azure hover:underline"
        >
          {componente.etiquetaAccion ?? t.portal.abrir}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          disabled={bloqueado}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-azure hover:underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
        >
          {componente.etiquetaAccion ?? t.portal.abrir}
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      )}
    </article>
  )
}

export function PortalPage() {
  const { portal, ui: t, loading } = useContent()
  const { usuario, salir } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-sand">
      <header className="bg-navy">
        <div className="container-page flex h-[70px] items-center gap-4">
          <Link to="/" aria-label={t.volverInicio}>
            <BmcLogo dark />
          </Link>

          <div className="ml-auto flex items-center gap-3">
            {usuario ? (
              <span className="hidden text-sm text-white/80 sm:inline">
                {t.portal.saludo}, <strong className="font-semibold text-white">{usuario.username}</strong>
              </span>
            ) : null}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/40 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {t.portal.volverAlSitio}
            </Link>
            {usuario ? (
              <button
                type="button"
                onClick={() => {
                  salir()
                  navigate('/')
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-tint"
              >
                <LogOut size={15} aria-hidden="true" />
                {t.acceso.cerrarSesion}
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="container-page py-12">
        <h1 className="text-3xl font-bold text-navy">{t.portal.titulo}</h1>
        <p className="mt-2 text-muted">{t.portal.subtitulo}</p>
        <span className="mt-5 block h-1 w-16 rounded-full bg-azure" aria-hidden="true" />

        {portal.length === 0 && !loading ? (
          <p className="mt-12 rounded-lg border border-dashed border-line bg-white p-8 text-center text-muted">
            {t.portal.sinComponentes}
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {portal.map((componente) => (
              <Tarjeta
                key={componente.clave}
                componente={componente}
                bloqueado={componente.requiereSesion && !usuario}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
