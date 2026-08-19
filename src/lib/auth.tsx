import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CMS_URL } from './cms'

export type Usuario = { id: number; username: string; email: string }

type Sesion = { jwt: string; user: Usuario }

type AuthState = {
  usuario: Usuario | null
  cargando: boolean
  entrar: (identifier: string, password: string) => Promise<void>
  registrar: (username: string, email: string, password: string) => Promise<void>
  salir: () => void
}

const CLAVE_SESION = 'bmc-sesion'

const AuthContext = createContext<AuthState>({
  usuario: null,
  cargando: false,
  entrar: async () => {},
  registrar: async () => {},
  salir: () => {},
})

function leerSesion(): Sesion | null {
  try {
    const bruto = localStorage.getItem(CLAVE_SESION)
    return bruto ? (JSON.parse(bruto) as Sesion) : null
  } catch {
    return null
  }
}

/** Extrae el mensaje que devuelve users-permissions cuando algo falla. */
async function errorDeStrapi(res: Response) {
  try {
    const cuerpo = (await res.json()) as { error?: { message?: string } }
    return cuerpo.error?.message ?? `HTTP ${res.status}`
  } catch {
    return `HTTP ${res.status}`
  }
}

/**
 * Sesión contra el plugin users-permissions de Strapi. El JWT se guarda en
 * localStorage: suficiente para una demo, pero para producción conviene una
 * cookie httpOnly emitida por un backend propio.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setSesion(leerSesion())
  }, [])

  const guardar = useCallback((nueva: Sesion) => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva))
    setSesion(nueva)
  }, [])

  const entrar = useCallback(
    async (identifier: string, password: string) => {
      setCargando(true)
      try {
        const res = await fetch(`${CMS_URL}/api/auth/local`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        })
        if (!res.ok) throw new Error(await errorDeStrapi(res))
        guardar((await res.json()) as Sesion)
      } finally {
        setCargando(false)
      }
    },
    [guardar],
  )

  const registrar = useCallback(
    async (username: string, email: string, password: string) => {
      setCargando(true)
      try {
        const res = await fetch(`${CMS_URL}/api/auth/local/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        })
        if (!res.ok) throw new Error(await errorDeStrapi(res))
        guardar((await res.json()) as Sesion)
      } finally {
        setCargando(false)
      }
    },
    [guardar],
  )

  const salir = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION)
    setSesion(null)
  }, [])

  const valor = useMemo<AuthState>(
    () => ({ usuario: sesion?.user ?? null, cargando, entrar, registrar, salir }),
    [sesion, cargando, entrar, registrar, salir],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
