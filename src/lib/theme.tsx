import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Tema = 'claro' | 'oscuro'

type TemaState = { tema: Tema; alternar: () => void; fijar: (t: Tema) => void }

const CLAVE = 'bmc-tema'

const TemaContext = createContext<TemaState>({ tema: 'claro', alternar: () => {}, fijar: () => {} })

/** Preferencia guardada; si no hay ninguna, la del sistema operativo. */
function temaInicial(): Tema {
  if (typeof window === 'undefined') return 'claro'

  const guardado = localStorage.getItem(CLAVE)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    const raiz = document.documentElement
    raiz.classList.toggle('oscuro', tema === 'oscuro')
    // Hace que los controles nativos (scrollbars, campos) sigan el tema.
    raiz.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light'
  }, [tema])

  // Si el usuario no ha elegido, seguir los cambios del sistema en vivo.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const alCambiar = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(CLAVE)) setTema(e.matches ? 'oscuro' : 'claro')
    }
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  const fijar = useCallback((siguiente: Tema) => {
    localStorage.setItem(CLAVE, siguiente)
    setTema(siguiente)
  }, [])

  const alternar = useCallback(
    () => fijar(document.documentElement.classList.contains('oscuro') ? 'claro' : 'oscuro'),
    [fijar],
  )

  return <TemaContext.Provider value={{ tema, alternar, fijar }}>{children}</TemaContext.Provider>
}

export function useTema() {
  return useContext(TemaContext)
}
