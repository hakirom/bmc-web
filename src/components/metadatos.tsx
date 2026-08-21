import { useEffect } from 'react'
import { useContent } from '@/lib/content-context'

function fijarMeta(nombre: string, contenido: string) {
  let etiqueta = document.querySelector<HTMLMetaElement>(`meta[name="${nombre}"]`)
  if (!etiqueta) {
    etiqueta = document.createElement('meta')
    etiqueta.name = nombre
    document.head.appendChild(etiqueta)
  }
  etiqueta.content = contenido
}

/**
 * Lleva al documento el SEO que se edita en el CMS (Home → SEO). El index.html
 * solo aporta un valor inicial para el primer pintado y para quien no ejecute
 * JavaScript; en cuanto responde el CMS, manda el contenido publicado.
 */
export function Metadatos() {
  const { seo, locale } = useContent()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (!seo) return

    document.title = seo.titulo
    fijarMeta('description', seo.descripcion)
    if (seo.palabrasClave) fijarMeta('keywords', seo.palabrasClave)
  }, [seo])

  return null
}
