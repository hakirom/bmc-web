import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, LogIn, UserPlus } from 'lucide-react'
import { BmcLogo } from '@/components/bmc-logo'
import { useAuth } from '@/lib/auth'
import { useContent } from '@/lib/content-context'
import { cn } from '@/lib/utils'

type Modo = 'entrar' | 'registro'

export function AccesoPage() {
  const { ui: t } = useContent()
  const { entrar, registrar, cargando } = useAuth()
  const navigate = useNavigate()

  const [modo, setModo] = useState<Modo>('entrar')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState<string | null>(null)

  const esRegistro = modo === 'registro'

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      if (esRegistro) await registrar(nombre, correo, clave)
      else await entrar(correo, clave)
      navigate('/portal')
    } catch (err) {
      const detalle = err instanceof Error ? err.message : ''
      setError(`${esRegistro ? t.acceso.errorRegistro : t.acceso.errorCredenciales}${detalle ? ` (${detalle})` : ''}`)
    }
  }

  return (
    <main className="hero-mesh flex min-h-screen items-center justify-center px-5 py-12">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          {t.volverInicio}
        </Link>

        <div className="rounded-lg border border-line bg-white p-8 shadow-2xl">
          <BmcLogo />

          <h1 className="mt-6 text-2xl font-bold text-navy">
            {esRegistro ? t.acceso.tituloRegistro : t.acceso.tituloEntrar}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {esRegistro ? t.acceso.subtituloRegistro : t.acceso.subtituloEntrar}
          </p>

          <form onSubmit={enviar} className="mt-6 space-y-4">
            {esRegistro ? (
              <Campo
                id="nombre"
                etiqueta={t.acceso.campoNombre}
                value={nombre}
                onChange={setNombre}
                autoComplete="username"
                required
              />
            ) : null}

            <Campo
              id="correo"
              etiqueta={t.acceso.campoCorreo}
              type="email"
              value={correo}
              onChange={setCorreo}
              autoComplete="email"
              required
            />

            <Campo
              id="clave"
              etiqueta={t.acceso.campoContrasena}
              type="password"
              value={clave}
              onChange={setClave}
              autoComplete={esRegistro ? 'new-password' : 'current-password'}
              required
              minLength={6}
            />

            {error ? (
              <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600 disabled:opacity-60"
            >
              {cargando ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : esRegistro ? (
                <UserPlus size={16} aria-hidden="true" />
              ) : (
                <LogIn size={16} aria-hidden="true" />
              )}
              {cargando ? t.acceso.procesando : esRegistro ? t.acceso.botonRegistrar : t.acceso.botonEntrar}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setModo(esRegistro ? 'entrar' : 'registro')
              setError(null)
            }}
            className="mt-5 w-full text-sm font-semibold text-azure hover:underline"
          >
            {esRegistro ? t.acceso.irAEntrar : t.acceso.irARegistro}
          </button>
        </div>
      </div>
    </main>
  )
}

function Campo({
  id,
  etiqueta,
  value,
  onChange,
  className,
  ...props
}: {
  id: string
  etiqueta: string
  value: string
  onChange: (v: string) => void
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'id'>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy">
        {etiqueta}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none transition-colors focus:border-azure',
          className,
        )}
        {...props}
      />
    </div>
  )
}
