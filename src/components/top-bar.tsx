import { useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EnlaceUi } from './enlace-ui'
import type { Locale } from '@/lib/cms'
import { useContent } from '@/lib/content-context'

const IDIOMAS: { code: Locale; corto: string; largo: string }[] = [
  { code: 'es', corto: 'Esp', largo: 'Español' },
  { code: 'en', corto: 'Ing', largo: 'Inglés' },
]

export function TopBar() {
  const { chrome, locale, setLocale, loading, ui: t } = useContent()
  const [open, setOpen] = useState(false)
  const activo = IDIOMAS.find((i) => i.code === locale) ?? IDIOMAS[0]!

  return (
    // `z-[60]` la deja por encima de la cabecera sticky (z-50); si no, el
    // desplegable de idioma queda tapado al abrirse.
    <div className="relative z-[60] hidden border-b border-line-dark/40 bg-navy-900 text-white lg:block">
      <div className="container-page flex h-9 items-center justify-end gap-6 text-[13px]">
        {chrome.utilityLinks.map((link) => (
          <EnlaceUi
            key={link.label}
            url={link.url}
            className="text-white/75 transition-colors hover:text-white"
          >
            {link.label}
          </EnlaceUi>
        ))}

        <div className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={t.cambiarIdioma}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded px-2 py-1 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            {loading ? <Loader2 size={12} className="animate-spin" aria-hidden="true" /> : null}
            {activo.corto}
            <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} aria-hidden="true" />
          </button>

          {open ? (
            <ul
              role="listbox"
              className="absolute right-0 top-full z-[70] mt-1 w-32 overflow-hidden rounded-md border border-line bg-white py-1 text-ink shadow-lg"
            >
              {IDIOMAS.map((idioma) => (
                <li key={idioma.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={locale === idioma.code}
                    onClick={() => {
                      setLocale(idioma.code)
                      setOpen(false)
                    }}
                    className={cn(
                      'block w-full px-3 py-1.5 text-left text-[13px] hover:bg-tint',
                      locale === idioma.code && 'font-semibold text-navy',
                    )}
                  >
                    {idioma.largo}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
