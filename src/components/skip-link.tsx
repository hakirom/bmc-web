import { useContent } from '@/lib/content-context'

/** Enlace de salto para navegación por teclado y lectores de pantalla. */
export function SkipLink() {
  const { ui: t } = useContent()

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
    >
      {t.saltarContenido}
    </a>
  )
}
