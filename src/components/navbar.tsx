import { useEffect, useState } from 'react'
import { Menu, Search, UserRound, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { megaMenu, utilityLinks } from '@/data/site'
import { BmcLogo } from './bmc-logo'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled || menuOpen ? 'bg-navy shadow-lg shadow-navy-900/20' : 'bg-navy/85 backdrop-blur-sm',
      )}
    >
      <nav className="container-page flex h-[70px] items-center gap-4" aria-label="Principal">
        <a href="#top" aria-label="Bolsa Mercantil de Colombia — inicio" className="shrink-0">
          <BmcLogo dark />
        </a>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md border border-white/45 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
          >
            <UserRound size={16} aria-hidden="true" />
            Acceso
          </a>
          <button
            type="button"
            aria-label="Buscar en el sitio"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-md p-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            {searchOpen ? <X size={20} aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
          </button>
          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-2 text-white transition-colors hover:bg-white/10"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {searchOpen ? (
        <div className="border-t border-line-dark bg-navy-800">
          <form
            className="container-page flex items-center gap-3 py-4"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <Search size={18} className="text-white/60" aria-hidden="true" />
            <input
              autoFocus
              type="search"
              placeholder="Buscar productos, mercados, boletines…"
              aria-label="Buscar"
              className="w-full bg-transparent py-1 text-white placeholder:text-white/45 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-azure px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-azure-light"
            >
              Buscar
            </button>
          </form>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="max-h-[calc(100vh-70px)] overflow-y-auto border-t border-line-dark bg-navy-800">
          <div className="container-page grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-4">
            {megaMenu.map((col) => (
              <div key={col.title}>
                <p className="border-b border-line-dark pb-2 text-xs font-bold uppercase tracking-[0.14em] text-azure-light">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="block rounded px-1 py-1 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-line-dark lg:hidden">
            <ul className="container-page flex flex-wrap gap-x-5 gap-y-2 py-4 text-sm">
              {utilityLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  )
}
