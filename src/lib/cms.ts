/**
 * Cliente REST de Strapi. Devuelve el contenido ya mapeado a las mismas formas
 * que usa `@/data/site`, de modo que los componentes no saben si los datos
 * vienen del CMS o del fallback local.
 */
import {
  contact as contactoLocal,
  footer as footerLocal,
  hero as heroLocal,
  marketBoard as marketBoardLocal,
  megaMenu as megaMenuLocal,
  servicesSection as serviciosLocal,
  stats as statsLocal,
  utilityLinks as utilidadesLocal,
  valueSection as valorLocal,
} from '@/data/site'
import { ui, type UiStrings } from '@/data/ui'

export type Locale = 'es' | 'en'

/** Navegación, pie de página e institucional: lo que rodea al contenido. */
export type EnlaceUi = { label: string; url: string }

export type SiteChrome = {
  utilityLinks: EnlaceUi[]
  accessLabel: string
  megaMenu: { title: string; links: string[] }[]
  footerDescription: string
  footerColumns: { title: string; links: string[] }[]
  socials: string[]
  certifications: { label: string; code: string }[]
  supervision: string
  listed: string
  legal: string
}

export const CMS_URL = import.meta.env.VITE_CMS_URL ?? 'http://localhost:1337'

type StrapiList<T> = { data: T[]; meta: { pagination?: { total: number } } }
type StrapiSingle<T> = { data: T | null }

type PlataformaCms = {
  titulo: string
  slug: string
  descripcion: string
  icono: string
  orden: number
  activa: boolean
  requiereSesion: boolean
  resumenDemo: string | null
  caracteristicas: { texto: string }[]
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

export type PlataformaDetalle = {
  title: string
  slug: string
  body: string
  icon: string
  requiereSesion: boolean
  caracteristicas: string[]
}

export type ComponentePortal = {
  clave: string
  titulo: string
  descripcion: string
  tipo: 'operaciones' | 'boletines' | 'tramites' | 'documentos' | 'soporte' | 'enlace'
  icono: string
  orden: number
  requiereSesion: boolean
  etiquetaAccion: string | null
}

type ComponentePortalCms = ComponentePortal & { activo: boolean }

type PasoGuion = { clave: string; mensaje: string }

type TextosCms = {
  guionPqrsf: PasoGuion[]
  acciones: Record<string, string>
  tablero: Record<string, string>
  boletines: Record<string, string>
  acceso: Record<string, string>
  portal: Record<string, string>
  pqrsf: Record<string, string>
}

type EnlaceCms = { etiqueta: string; url: string }
type ColumnaCms = { titulo: string; enlaces: EnlaceCms[] }

type ConfiguracionCms = {
  barraUtilidades: EnlaceCms[]
  etiquetaAcceso: string
  menuPrincipal: ColumnaCms[]
  descripcionFooter: string
  columnasFooter: ColumnaCms[]
  redesSociales: EnlaceCms[]
  certificaciones: { etiqueta: string; codigo: string }[]
  vigilancia: string
  listadoEn: string
  legal: string
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
  etiquetaPlataformas: string
  tituloTablero: string
  ctaTablero: string
  notaTablero: string
  eyebrowBoletines: string
  tituloBoletines: string
  eyebrowContacto: string
  tituloContacto: string
  cifras: { valor: string; etiqueta: string }[]
  mensajesValor: { texto: string }[]
  tarjetasContacto: { titulo: string; icono: string; lineas: string; cta: string | null }[]
}

/** Contenido que consume la UI, con la misma forma que el fallback local. */
export type SiteContent = {
  source: 'cms' | 'local'
  locale: Locale
  chrome: SiteChrome
  ui: UiStrings
  plataformas: PlataformaDetalle[]
  portal: ComponentePortal[]
  /** Guion del asistente PQRSF, indexado por clave de paso. */
  guionPqrsf: Record<string, string>
  hero: typeof heroLocal
  servicesSection: typeof serviciosLocal
  valueSection: typeof valorLocal
  stats: typeof statsLocal
  contact: typeof contactoLocal
  marketBoard: typeof marketBoardLocal
  boletinesSection: { eyebrow: string; title: string }
  boletines: BoletinCms[]
}

const chromeLocal: SiteChrome = {
  utilityLinks: utilidadesLocal.map((label) => ({ label, url: '#' })),
  accessLabel: 'Acceso',
  megaMenu: megaMenuLocal.map((c) => ({ title: c.title, links: [...c.links] })),
  footerDescription:
    'Bolsa de productos y servicios de Colombia. Mercados eficientes, transparentes y seguros.',
  footerColumns: footerLocal.columns,
  socials: footerLocal.socials,
  certifications: footerLocal.certifications.map((c) => ({ label: c.label, code: c.value })),
  supervision: footerLocal.supervision,
  listed: footerLocal.listed,
  legal: footerLocal.legal,
}

export const localContent: SiteContent = {
  source: 'local',
  locale: 'es',
  chrome: chromeLocal,
  ui: ui.es,
  // Derivado del hero local: permite abrir el panel de cada plataforma aunque
  // el CMS no responda. El portal queda vacío a propósito — sus componentes
  // solo existen en Strapi y el badge avisa de que no hay conexión.
  plataformas: heroLocal.platforms.map((p) => ({
    title: p.title,
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    body: p.body,
    icon: p.icon,
    requiereSesion: false,
    caracteristicas: [],
  })),
  portal: [],
  guionPqrsf: {},
  hero: heroLocal,
  servicesSection: serviciosLocal,
  valueSection: valorLocal,
  stats: statsLocal,
  contact: contactoLocal,
  marketBoard: marketBoardLocal,
  boletinesSection: {
    eyebrow: 'Boletines del mercado',
    title: 'Información y análisis para decidir a tiempo',
  },
  boletines: [],
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${CMS_URL}/api${path}`, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Strapi respondió ${res.status} en ${path}`)
  return (await res.json()) as T
}

function mapMarketBoard(
  operaciones: OperacionCms[],
  t: UiStrings,
  etiquetas: { titulo: string; cta: string; nota: string },
): SiteContent['marketBoard'] {
  const numeros = new Intl.NumberFormat(t.intlLocale, { maximumFractionDigits: 0 })
  const formatoPesos = (valor: number) => `$ ${numeros.format(valor)}`
  const formatoTasa = (tasa: number) =>
    `${new Intl.NumberFormat(t.intlLocale, { minimumFractionDigits: 2 }).format(tasa)} %`

  const fisicos = operaciones.filter((o) => o.tipoMercado === 'fisicos')
  const financieros = operaciones.filter((o) => o.tipoMercado === 'financieros')
  const total = operaciones.reduce((sum, o) => sum + Number(o.valor), 0)
  const fecha = operaciones[0]?.fecha

  return {
    title: etiquetas.titulo,
    cta: etiquetas.cta,
    note: etiquetas.nota,
    date: fecha ? fecha.split('-').reverse().join('/') : marketBoardLocal.date,
    summary: [
      { label: t.numeroOperaciones, value: numeros.format(operaciones.length) },
      { label: t.valorNegociado, value: formatoPesos(total) },
    ],
    tabs: [
      {
        label: t.mercadoFisicos,
        columns: [t.columnas.negocio, t.columnas.producto, t.columnas.cantidad, t.columnas.valor],
        rows: fisicos.map((o) => [o.numeroNegocio, o.concepto, o.cantidad ?? '—', formatoPesos(o.valor)]),
      },
      {
        label: t.mercadoFinancieros,
        columns: [t.columnas.negocio, t.columnas.instrumento, t.columnas.valor, t.columnas.tasa],
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

const POPULATE_CONFIG = [
  'populate[barraUtilidades]=true',
  'populate[redesSociales]=true',
  'populate[certificaciones]=true',
  'populate[menuPrincipal][populate][enlaces]=true',
  'populate[columnasFooter][populate][enlaces]=true',
].join('&')

/** Mezcla los textos del CMS sobre el diccionario local, que actúa de respaldo. */
function mapTextos(base: UiStrings, cms: TextosCms | null): UiStrings {
  if (!cms) return base

  return {
    ...base,
    conocerMas: cms.acciones.conocerMas ?? base.conocerMas,
    verTodosServicios: cms.acciones.verTodosServicios ?? base.verTodosServicios,
    leerBoletin: cms.acciones.leerBoletin ?? base.leerBoletin,
    anterior: cms.acciones.anterior ?? base.anterior,
    siguiente: cms.acciones.siguiente ?? base.siguiente,
    buscar: cms.acciones.buscar ?? base.buscar,
    buscarPlaceholder: cms.acciones.buscarPlaceholder ?? base.buscarPlaceholder,
    abrirMenu: cms.acciones.abrirMenu ?? base.abrirMenu,
    cerrarMenu: cms.acciones.cerrarMenu ?? base.cerrarMenu,
    cambiarIdioma: cms.acciones.cambiarIdioma ?? base.cambiarIdioma,
    saltarContenido: cms.acciones.saltarContenido ?? base.saltarContenido,
    volverInicio: cms.acciones.volverInicio ?? base.volverInicio,
    mercadoFisicos: cms.tablero.mercadoFisicos ?? base.mercadoFisicos,
    mercadoFinancieros: cms.tablero.mercadoFinancieros ?? base.mercadoFinancieros,
    columnas: {
      negocio: cms.tablero.colNegocio ?? base.columnas.negocio,
      producto: cms.tablero.colProducto ?? base.columnas.producto,
      cantidad: cms.tablero.colCantidad ?? base.columnas.cantidad,
      valor: cms.tablero.colValor ?? base.columnas.valor,
      instrumento: cms.tablero.colInstrumento ?? base.columnas.instrumento,
      tasa: cms.tablero.colTasa ?? base.columnas.tasa,
    },
    numeroOperaciones: cms.tablero.numeroOperaciones ?? base.numeroOperaciones,
    valorNegociado: cms.tablero.valorNegociado ?? base.valorNegociado,
    fechaCierre: cms.tablero.fechaCierre ?? base.fechaCierre,
    categorias: {
      'boletin-diario': cms.boletines.catBoletinDiario ?? base.categorias['boletin-diario'],
      'estudio-economico': cms.boletines.catEstudioEconomico ?? base.categorias['estudio-economico'],
      comunicado: cms.boletines.catComunicado ?? base.categorias.comunicado,
    },
    destacado: cms.boletines.destacado ?? base.destacado,
    acceso: { ...base.acceso, ...cms.acceso },
    portal: { ...base.portal, ...cms.portal },
    pqrsf: { ...base.pqrsf, ...cms.pqrsf },
  }
}

const columnas = (cols: ColumnaCms[]) =>
  cols.map((c) => ({ title: c.titulo, links: c.enlaces.map((e) => e.etiqueta) }))

/** Trae todo el contenido del CMS en un idioma. Lanza si Strapi no responde. */
export async function fetchSiteContent(
  locale: Locale = 'es',
  signal?: AbortSignal,
): Promise<SiteContent> {
  const l = `locale=${locale}`

  const [
    home,
    plataformas,
    servicios,
    operaciones,
    boletines,
    configuracion,
    textos,
    portal,
  ] = await Promise.all([
    get<StrapiSingle<HomeCms>>(`/home?${l}&populate=*`, signal),
    get<StrapiList<PlataformaCms>>(`/plataformas?${l}&sort=orden:asc&populate=caracteristicas`, signal),
    get<StrapiList<ServicioCms>>(`/servicios?${l}&populate=enlaces&sort=orden:asc`, signal),
    get<StrapiList<OperacionCms>>(
      `/operaciones-mercado?pagination[pageSize]=100&sort=numeroNegocio:asc`,
      signal,
    ),
    get<StrapiList<BoletinCms>>(`/boletines?${l}&sort=fecha:desc&pagination[pageSize]=6`, signal),
    get<StrapiSingle<ConfiguracionCms>>(`/configuracion-sitio?${l}&${POPULATE_CONFIG}`, signal),
    get<StrapiSingle<TextosCms>>(`/textos-interfaz?${l}&populate=*`, signal),
    get<StrapiList<ComponentePortalCms>>(`/componentes-portal?${l}&sort=orden:asc`, signal),
  ])

  const h = home.data
  if (!h) throw new Error('El single type Home no tiene contenido publicado')

  const cfg = configuracion.data
  const t = mapTextos(ui[locale], textos.data)

  const guionPqrsf = Object.fromEntries(
    (textos.data?.guionPqrsf ?? []).map((paso) => [paso.clave, paso.mensaje]),
  )

  // El interruptor `activa` del CMS decide qué plataformas se publican.
  const plataformasActivas = plataformas.data.filter((p) => p.activa)

  return {
    source: 'cms',
    locale,
    ui: t,
    chrome: cfg
      ? {
          utilityLinks: cfg.barraUtilidades.map((e) => ({ label: e.etiqueta, url: e.url || '#' })),
          accessLabel: cfg.etiquetaAcceso,
          megaMenu: columnas(cfg.menuPrincipal),
          footerDescription: cfg.descripcionFooter,
          footerColumns: columnas(cfg.columnasFooter),
          socials: cfg.redesSociales.map((e) => e.etiqueta),
          certifications: cfg.certificaciones.map((c) => ({ label: c.etiqueta, code: c.codigo })),
          supervision: cfg.vigilancia,
          listed: cfg.listadoEn,
          legal: cfg.legal,
        }
      : chromeLocal,
    hero: {
      ...heroLocal,
      platformsLabel: h.etiquetaPlataformas,
      eyebrow: h.eyebrow,
      title: h.titulo,
      subtitle: h.subtitulo,
      ctaPrimary: h.ctaPrimario,
      ctaSecondary: h.ctaSecundario ?? heroLocal.ctaSecondary,
      platforms: plataformasActivas.map((p) => ({
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
      eyebrow: h.eyebrowContacto,
      title: h.tituloContacto,
      cards: h.tarjetasContacto.map((t) => ({
        title: t.titulo,
        icon: t.icono,
        links: t.lineas.split('\n').filter(Boolean),
        cta: t.cta ?? 'Conoce más',
      })),
    },
    marketBoard: mapMarketBoard(operaciones.data, t, {
      titulo: h.tituloTablero,
      cta: h.ctaTablero,
      nota: h.notaTablero,
    }),
    boletinesSection: { eyebrow: h.eyebrowBoletines, title: h.tituloBoletines },
    plataformas: plataformasActivas.map((p) => ({
      title: p.titulo,
      slug: p.slug,
      body: p.resumenDemo ?? p.descripcion,
      icon: p.icono,
      requiereSesion: p.requiereSesion,
      caracteristicas: (p.caracteristicas ?? []).map((c) => c.texto),
    })),
    portal: portal.data
      .filter((c) => c.activo)
      .map(({ activo: _activo, ...c }) => c),
    guionPqrsf,
    boletines: boletines.data,
  }
}
