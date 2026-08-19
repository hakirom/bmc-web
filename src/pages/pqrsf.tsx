import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Bot, CheckCircle2, RotateCcw, Send, User } from 'lucide-react'
import { BmcLogo } from '@/components/bmc-logo'
import { CMS_URL } from '@/lib/cms'
import { useContent } from '@/lib/content-context'
import { motorLocal, type Borrador, type EstadoChat, type Guion } from '@/lib/asistente-pqrsf'
import { cn } from '@/lib/utils'

type Mensaje = { de: 'asistente' | 'persona'; texto: string }

/** Radicado legible: BMC-AAAAMMDD-XXXX */
function nuevoRadicado() {
  const hoy = new Date()
  const fecha = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0'),
  ].join('')
  const azar = Math.floor(1000 + Math.random() * 9000)
  return `BMC-${fecha}-${azar}`
}

async function radicar(borrador: Borrador, transcripcion: Mensaje[]) {
  const radicado = nuevoRadicado()

  const res = await fetch(`${CMS_URL}/api/solicitudes-pqrsf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        radicado,
        tipo: borrador.tipo,
        asunto: borrador.asunto,
        mensaje: borrador.mensaje,
        nombre: borrador.nombre,
        correo: borrador.correo,
        estado: 'recibida',
        canal: 'asistente-web',
        transcripcion,
      },
    }),
  })

  if (!res.ok) throw new Error(`El CMS respondió ${res.status}`)
  return radicado
}

export function PqrsfPage() {
  const { ui: t, guionPqrsf } = useContent()
  const guion = useMemo<Guion>(() => guionPqrsf, [guionPqrsf])

  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [estado, setEstado] = useState<EstadoChat>({ paso: 'tipo', borrador: {} })
  const [opciones, setOpciones] = useState<{ etiqueta: string; valor: string }[]>([])
  const [entrada, setEntrada] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const [radicado, setRadicado] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const finRef = useRef<HTMLDivElement>(null)

  // Arranca (o reinicia) la conversación cuando el guion del CMS está listo.
  useEffect(() => {
    const inicio = motorLocal.iniciar(guion)
    setMensajes(inicio.mensajes.map((texto) => ({ de: 'asistente' as const, texto })))
    setEstado(inicio.estado)
    setOpciones(inicio.opciones ?? [])
    setRadicado(null)
    setError(null)
  }, [guion])

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensajes, escribiendo, radicado])

  async function enviar(texto: string) {
    const limpio = texto.trim()
    if (!limpio || escribiendo || radicado) return

    const visible = limpio.startsWith('__')
      ? (opciones.find((o) => o.valor === limpio)?.etiqueta ?? limpio)
      : limpio

    const historial: Mensaje[] = [...mensajes, { de: 'persona', texto: visible }]
    setMensajes(historial)
    setEntrada('')
    setOpciones([])
    setEscribiendo(true)

    // Pequeña pausa: sin ella el chat responde tan rápido que no se lee.
    await new Promise((r) => setTimeout(r, 450))

    const respuesta = motorLocal.responder(estado, limpio, guion)
    setEstado(respuesta.estado)

    if (respuesta.mensajes.length > 0) {
      setMensajes([...historial, ...respuesta.mensajes.map((m) => ({ de: 'asistente' as const, texto: m }))])
    }
    setOpciones(respuesta.opciones ?? [])

    if (respuesta.listoParaRadicar) {
      try {
        const numero = await radicar(respuesta.estado.borrador, historial)
        setRadicado(numero)
        setMensajes((prev) => [...prev, { de: 'asistente', texto: guion.cierre ?? '' }])
      } catch (err) {
        setError(err instanceof Error ? `${t.pqrsf.errorEnvio} (${err.message})` : t.pqrsf.errorEnvio)
      }
    }

    setEscribiendo(false)
  }

  function reiniciar() {
    const inicio = motorLocal.iniciar(guion)
    setMensajes(inicio.mensajes.map((texto) => ({ de: 'asistente' as const, texto })))
    setEstado(inicio.estado)
    setOpciones(inicio.opciones ?? [])
    setRadicado(null)
    setError(null)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void enviar(entrada)
  }

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <header className="bg-navy">
        <div className="container-page flex h-[70px] items-center gap-4">
          <Link to="/" aria-label={t.volverInicio}>
            <BmcLogo dark />
          </Link>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-white/40 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            {t.volverInicio}
          </Link>
        </div>
      </header>

      <main className="container-page flex w-full max-w-3xl flex-1 flex-col py-10">
        <h1 className="text-2xl font-bold text-navy">{t.pqrsf.titulo}</h1>
        <p className="mt-1 text-sm text-muted">{t.pqrsf.subtitulo}</p>

        <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-lg border border-line bg-white">
          <ul className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
            {mensajes.map((m, i) => (
              <li
                key={`${i}-${m.texto.slice(0, 12)}`}
                className={cn('flex gap-3', m.de === 'persona' && 'flex-row-reverse')}
              >
                <span
                  className={cn(
                    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    m.de === 'asistente' ? 'bg-navy text-white' : 'bg-tint text-navy',
                  )}
                >
                  {m.de === 'asistente' ? <Bot size={16} aria-hidden="true" /> : <User size={16} aria-hidden="true" />}
                </span>
                <p
                  className={cn(
                    'max-w-[80%] whitespace-pre-line rounded-lg px-4 py-2.5 text-sm leading-relaxed',
                    m.de === 'asistente' ? 'bg-tint text-ink' : 'bg-navy text-white',
                  )}
                >
                  {m.texto}
                </p>
              </li>
            ))}

            {escribiendo ? (
              <li className="flex items-center gap-3 text-sm text-muted">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white">
                  <Bot size={16} aria-hidden="true" />
                </span>
                {t.pqrsf.escribiendo}
              </li>
            ) : null}

            {radicado ? (
              <li className="rounded-lg border border-emerald-300 bg-emerald-50 p-4">
                <p className="flex items-center gap-2 font-semibold text-emerald-900">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {t.pqrsf.radicadoTitulo}
                </p>
                <p className="mt-2 font-mono text-lg font-bold text-emerald-900">{radicado}</p>
                <p className="mt-1 text-sm text-emerald-800">{t.pqrsf.radicadoAviso}</p>
              </li>
            ) : null}

            {error ? (
              <li role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </li>
            ) : null}

            <div ref={finRef} />
          </ul>

          {opciones.length > 0 && !radicado ? (
            <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3">
              {opciones.map((opcion) => (
                <button
                  key={opcion.valor}
                  type="button"
                  onClick={() => void enviar(opcion.valor)}
                  className="rounded-full border border-azure/40 bg-tint px-3.5 py-1.5 text-sm font-semibold text-navy transition-colors hover:border-azure hover:bg-azure hover:text-white"
                >
                  {opcion.etiqueta}
                </button>
              ))}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="flex items-center gap-3 border-t border-line p-4">
            {radicado ? (
              <button
                type="button"
                onClick={reiniciar}
                className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
              >
                <RotateCcw size={15} aria-hidden="true" />
                {t.pqrsf.reiniciar}
              </button>
            ) : (
              <>
                <input
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  placeholder={t.pqrsf.placeholder}
                  aria-label={t.pqrsf.placeholder}
                  className="w-full rounded-md border border-line px-3 py-2.5 text-sm outline-none transition-colors focus:border-azure"
                />
                <button
                  type="submit"
                  disabled={escribiendo || entrada.trim().length === 0}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600 disabled:opacity-50"
                >
                  <Send size={15} aria-hidden="true" />
                  {t.pqrsf.enviar}
                </button>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
