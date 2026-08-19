import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { utilityLinks } from '@/data/site'

export function TopBar() {
  const [lang, setLang] = useState<'Esp' | 'Ing'>('Esp')
  const [open, setOpen] = useState(false)

  return (
    <div className="hidden border-b border-line-dark/40 bg-navy-900 text-white lg:block">
      <div className="container-page flex h-9 items-center justify-end gap-6 text-[13px]">
        {utilityLinks.map((link) => (
          <a key={link} href="#" className="text-white/75 transition-colors hover:text-white">
            {link}
          </a>
        ))}

        <div className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded px-2 py-1 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            {lang}
            <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} aria-hidden="true" />
          </button>
          {open ? (
            <ul
              role="listbox"
              className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-md border border-line bg-white py-1 text-ink shadow-lg"
            >
              {(['Esp', 'Ing'] as const).map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={lang === option}
                    onClick={() => {
                      setLang(option)
                      setOpen(false)
                    }}
                    className="block w-full px-3 py-1.5 text-left text-[13px] hover:bg-tint"
                  >
                    {option === 'Esp' ? 'Español' : 'Inglés'}
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
