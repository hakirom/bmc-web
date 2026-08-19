import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchSiteContent, localContent, type Locale, type SiteContent } from './cms'

type ContentState = SiteContent & {
  loading: boolean
  error: string | null
  setLocale: (locale: Locale) => void
}

const ContentContext = createContext<ContentState>({
  ...localContent,
  loading: true,
  error: null,
  setLocale: () => {},
})

/**
 * Carga el contenido desde Strapi en el idioma activo. Si el CMS no responde,
 * la página sigue funcionando con el contenido local (`source: 'local'`).
 */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')
  const [state, setState] = useState<SiteContent & { loading: boolean; error: string | null }>({
    ...localContent,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true }))

    fetchSiteContent(locale, controller.signal)
      .then((content) => setState({ ...content, loading: false, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Error desconocido'
        console.warn('[cms] Usando contenido local:', message)
        setState({ ...localContent, locale, loading: false, error: message })
      })

    return () => controller.abort()
  }, [locale])

  const cambiarIdioma = useCallback((next: Locale) => setLocale(next), [])

  return (
    <ContentContext.Provider value={{ ...state, setLocale: cambiarIdioma }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
