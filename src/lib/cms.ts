/**
 * Cliente REST de Strapi. Devuelve el contenido ya mapeado a las mismas formas
 * que usa `@/data/site`, de modo que los componentes no saben si los datos
 * vienen del CMS o del fallback local.
 */
import {
  contact as contactoLocal,
  hero as heroLocal,
  marketBoard as marketBoardLocal,
  servicesSection as serviciosLocal,
  stats as statsLocal,
  valueSection as valorLocal,
} from '@/data/site'

export const CMS_URL = import.meta.env.VITE_CMS_URL ?? 'http://localhost:1337'

type StrapiList<T> = { data: T[]; meta: { pagination?: { total: number } } }
type StrapiSingle<T> = { data: T | null }

type PlataformaCms = {
  titulo: string
  descripcion: string
  icono: string
  orden: number
}

type ServicioCms = {
  titulo: string
  descripcion: string
  icono: string
  orden: number
  enlaces: { etiqueta: string; url: string }[]
}

type OperacionCms = {
  numeroNegocio: string
  tipoMercado: 'fisicos' | 'financieros'
  concepto: string
  cantidad: string | null
  valor: number
  tasa: number | null
  fecha: string
}

export type BoletinCms = {
  documentId: string
  titulo: string
  slug: string
  fecha: string
  resumen: string
  categoria: 'boletin-diario' | 'estudio-economico' | 'comunicado'
  destacado: boolean
}

type HomeCms = {
  eyebrow: string
  titulo: string
  subtitulo: string
  ctaPrimario: string
  ctaSecundario: string | null
  tituloServicios: string
  introServicios: string
  tituloValor: string
  cifras: { valor: string; etiqueta: string }[]
  mensajesValor: { texto: string }[]
  tarjetasContacto: { titulo: string; icono: string; lineas: string; cta: string | null }[]
}

/** Contenido que consume la UI, con la misma forma que el fallback local. */
export type SiteContent = {
  source: 'cms' | 'local'
  hero: typeof heroLocal
  servicesSection: typeof serviciosLocal
  valueSection: typeof valorLocal
  stats: typeof statsLocal
  contact: typeof contactoLocal
  marketBoard: typeof marketBoardLocal
  boletines: BoletinCms[]
}

export const localContent: SiteContent = {
  source: 'local',
  hero: heroLocal,
  servicesSection: serviciosLocal,
  valueSection: valorLocal,
  stats: statsLocal,
  contact: contactoLocal,
  marketBoard: marketBoardLocal,
  boletines: [],
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${CMS_URL}/api${path}`, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Strapi respondió ${res.status} en ${path}`)
  return (await res.json()) as T
}

const pesos = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })
const formatoPesos = (valor: number) => `$ ${pesos.format(valor)}`
const formatoTasa = (tasa: number) => `${tasa.toFixed(2).replace('.', ',')} %`

function mapMarketBoard(operaciones: OperacionCms[]): SiteContent['marketBoard'] {
  const fisicos = operaciones.filter((o) => o.tipoMercado === 'fisicos')
  const financieros = operaciones.filter((o) => o.tipoMercado === 'financieros')
  const total = operaciones.reduce((sum, o) => sum + Number(o.valor), 0)
  const fecha = operaciones[0]?.fecha

  return {
    ...marketBoardLocal,
    date: fecha ? fecha.split('-').reverse().join('/') : marketBoardLocal.date,
    summary: [
      { label: 'Número operaciones', value: pesos.format(operaciones.length) },
      { label: 'Valor negociado', value: formatoPesos(total) },
    ],
    tabs: [
      {
        label: 'Mercado de físicos',
        columns: ['N° Negocio', 'Producto', 'Cantidad', 'Valor'],
        rows: fisicos.map((o) => [o.numeroNegocio, o.concepto, o.cantidad ?? '—', formatoPesos(o.valor)]),
      },
      {
        label: 'Mercado de financieros',
        columns: ['N° Negocio', 'Instrumento', 'Valor', 'Tasa E.A.'],
        rows: financieros.map((o) => [
          o.numeroNegocio,
          o.concepto,
          formatoPesos(o.valor),
          o.tasa != null ? formatoTasa(Number(o.tasa)) : '—',
        ]),
      },
    ],
  }
}

/** Trae todo el contenido del CMS. Lanza si Strapi no está disponible. */
export async function fetchSiteContent(signal?: AbortSignal): Promise<SiteContent> {
  const [home, plataformas, servicios, operaciones, boletines] = await Promise.all([
    get<StrapiSingle<HomeCms>>('/home?populate=*', signal),
    get<StrapiList<PlataformaCms>>('/plataformas?sort=orden:asc', signal),
    get<StrapiList<ServicioCms>>('/servicios?populate=enlaces&sort=orden:asc', signal),
    get<StrapiList<OperacionCms>>('/operaciones-mercado?pagination[pageSize]=100&sort=numeroNegocio:asc', signal),
    get<StrapiList<BoletinCms>>('/boletines?sort=fecha:desc&pagination[pageSize]=6', signal),
  ])

  const h = home.data
  if (!h) throw new Error('El single type Home no tiene contenido publicado')

  return {
    source: 'cms',
    hero: {
      ...heroLocal,
      eyebrow: h.eyebrow,
      title: h.titulo,
      subtitle: h.subtitulo,
      ctaPrimary: h.ctaPrimario,
      ctaSecondary: h.ctaSecundario ?? heroLocal.ctaSecondary,
      platforms: plataformas.data.map((p) => ({
        title: p.titulo,
        body: p.descripcion,
        icon: p.icono,
      })),
    },
    servicesSection: {
      ...serviciosLocal,
      title: h.tituloServicios,
      intro: h.introServicios,
      groups: servicios.data.map((s) => ({
        title: s.titulo,
        body: s.descripcion,
        icon: s.icono,
        links: s.enlaces.map((e) => e.etiqueta),
      })),
    },
    valueSection: {
      eyebrow: h.tituloValor,
      slides: h.mensajesValor.map((m) => m.texto),
    },
    stats: h.cifras.map((c) => ({ value: c.valor, label: c.etiqueta })),
    contact: {
      ...contactoLocal,
      cards: h.tarjetasContacto.map((t) => ({
        title: t.titulo,
        icon: t.icono,
        links: t.lineas.split('\n').filter(Boolean),
        cta: t.cta ?? 'Conoce más',
      })),
    },
    marketBoard: mapMarketBoard(operaciones.data),
    boletines: boletines.data,
  }
}
