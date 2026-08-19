/**
 * Motor del asistente PQRSF.
 *
 * Implementación local: clasifica por palabras clave y conduce la conversación
 * paso a paso, sin llamadas externas ni claves. `MotorAsistente` es el punto de
 * extensión: para usar un modelo real basta con otra implementación de la misma
 * interfaz (por ejemplo, un endpoint proxy en Strapi) y cambiarla en el chat.
 */

export type TipoPqrsf = 'peticion' | 'queja' | 'reclamo' | 'sugerencia' | 'felicitacion'

export type Paso = 'tipo' | 'asunto' | 'detalle' | 'nombre' | 'correo' | 'confirmacion' | 'cerrado'

export type Borrador = {
  tipo?: TipoPqrsf
  asunto?: string
  mensaje?: string
  nombre?: string
  correo?: string
}

export type EstadoChat = {
  paso: Paso
  borrador: Borrador
}

export type Respuesta = {
  estado: EstadoChat
  mensajes: string[]
  opciones?: { etiqueta: string; valor: string }[]
  /** Cuando llega a true, el chat radica el caso en el CMS. */
  listoParaRadicar?: boolean
}

export type Guion = Partial<Record<string, string>>

export interface MotorAsistente {
  iniciar(guion: Guion): Respuesta
  responder(estado: EstadoChat, texto: string, guion: Guion): Respuesta
}

const PALABRAS: Record<TipoPqrsf, string[]> = {
  queja: ['queja', 'molesto', 'mal servicio', 'demora', 'grosero', 'complaint', 'rude'],
  reclamo: ['reclamo', 'error', 'cobro', 'devolución', 'devolucion', 'incumplimiento', 'claim', 'refund'],
  peticion: ['petición', 'peticion', 'solicito', 'necesito', 'información', 'informacion', 'request', 'need'],
  sugerencia: ['sugerencia', 'propongo', 'sería bueno', 'seria bueno', 'suggest', 'idea'],
  felicitacion: ['felicitación', 'felicitacion', 'gracias', 'excelente', 'felicito', 'thank', 'great'],
}

export const ETIQUETAS_TIPO: Record<TipoPqrsf, string> = {
  peticion: 'Petición',
  queja: 'Queja',
  reclamo: 'Reclamo',
  sugerencia: 'Sugerencia',
  felicitacion: 'Felicitación',
}

/** Busca el tipo por palabras clave; devuelve null si no hay señal clara. */
export function clasificar(texto: string): TipoPqrsf | null {
  const limpio = texto.toLowerCase()
  for (const [tipo, palabras] of Object.entries(PALABRAS) as [TipoPqrsf, string[]][]) {
    if (palabras.some((palabra) => limpio.includes(palabra))) return tipo
  }
  return null
}

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const OPCIONES_TIPO = (Object.keys(ETIQUETAS_TIPO) as TipoPqrsf[]).map((valor) => ({
  valor,
  etiqueta: ETIQUETAS_TIPO[valor],
}))

function resumen(borrador: Borrador) {
  return [
    `Tipo: ${borrador.tipo ? ETIQUETAS_TIPO[borrador.tipo] : '—'}`,
    `Asunto: ${borrador.asunto ?? '—'}`,
    `Nombre: ${borrador.nombre ?? '—'}`,
    `Correo: ${borrador.correo ?? '—'}`,
  ].join('\n')
}

export const motorLocal: MotorAsistente = {
  iniciar(guion) {
    return {
      estado: { paso: 'tipo', borrador: {} },
      mensajes: [guion.saludo ?? '¿En qué podemos ayudarle?'],
    }
  },

  responder({ paso, borrador }, texto, guion) {
    const entrada = texto.trim()

    switch (paso) {
      case 'tipo': {
        const tipo = clasificar(entrada)
        if (!tipo) {
          return {
            estado: { paso: 'tipo', borrador: { ...borrador, mensaje: entrada } },
            mensajes: [guion.tipo ?? '¿Qué tipo de solicitud es?'],
            opciones: OPCIONES_TIPO,
          }
        }
        return {
          estado: { paso: 'asunto', borrador: { ...borrador, tipo, mensaje: entrada } },
          mensajes: [
            `Lo registro como ${ETIQUETAS_TIPO[tipo].toLowerCase()}.`,
            guion.asunto ?? 'Resúmalo en una frase corta.',
          ],
        }
      }

      case 'asunto':
        return {
          estado: { paso: 'detalle', borrador: { ...borrador, asunto: entrada } },
          mensajes: [guion.detalle ?? 'Cuénteme el detalle.'],
        }

      case 'detalle':
        return {
          estado: {
            paso: 'nombre',
            borrador: { ...borrador, mensaje: [borrador.mensaje, entrada].filter(Boolean).join('\n\n') },
          },
          mensajes: [guion.nombre ?? '¿A nombre de quién la radico?'],
        }

      case 'nombre':
        return {
          estado: { paso: 'correo', borrador: { ...borrador, nombre: entrada } },
          mensajes: [guion.correo ?? '¿A qué correo le respondemos?'],
        }

      case 'correo': {
        if (!CORREO.test(entrada)) {
          return {
            estado: { paso: 'correo', borrador },
            mensajes: [guion.noEntendido ?? 'Ese correo no parece válido. ¿Puede repetirlo?'],
          }
        }
        const actualizado = { ...borrador, correo: entrada }
        return {
          estado: { paso: 'confirmacion', borrador: actualizado },
          mensajes: [guion.confirmacion ?? 'Revise el resumen:', resumen(actualizado)],
          opciones: [
            { etiqueta: 'Radicar', valor: '__radicar__' },
            { etiqueta: 'Corregir', valor: '__corregir__' },
          ],
        }
      }

      case 'confirmacion': {
        if (entrada === '__corregir__') {
          return {
            estado: { paso: 'tipo', borrador: {} },
            mensajes: [guion.saludo ?? 'Empecemos de nuevo.'],
          }
        }
        return {
          estado: { paso: 'cerrado', borrador },
          mensajes: [],
          listoParaRadicar: true,
        }
      }

      default:
        return { estado: { paso, borrador }, mensajes: [guion.cierre ?? 'Su caso ya fue radicado.'] }
    }
  },
}
