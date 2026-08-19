import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchSiteContent, localContent, type SiteContent } from './cms'

type ContentState = SiteContent & { loading: boolean; error: string | null }

const ContentContext = createContext<ContentState>({ ...localContent, loading: true, error: null })

/**
 * Carga el contenido desde Strapi. Si el CMS no responde, la página sigue
 * funcionando con el contenido local (`source: 'local'`).
 */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({ ...localContent, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchSiteContent(controller.signal)
      .then((content) => setState({ ...content, loading: false, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Error desconocido'
        console.warn('[cms] Usando contenido local:', message)
        setState({ ...localContent, loading: false, error: message })
      })

    return () => controller.abort()
  }, [])

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}
