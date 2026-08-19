import { ShieldCheck } from 'lucide-react'
import { useContent } from '@/lib/content-context'
import { BmcLogo } from './bmc-logo'

export function SiteFooter() {
  const { chrome } = useContent()

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[240px_1fr]">
        <div>
          <BmcLogo dark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            {chrome.footerDescription}
          </p>
          <ul className="mt-6 flex flex-wrap gap-3 text-sm">
            {chrome.socials.map((social) => (
              <li key={social}>
                <a
                  href="#"
                  className="rounded border border-white/20 px-2.5 py-1 text-white/70 transition-colors hover:border-white hover:text-white"
                >
                  {social}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {chrome.footerColumns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-azure-light">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/70 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-page flex flex-wrap items-center gap-x-8 gap-y-4 py-6 text-[13px] text-white/60">
          {chrome.certifications.map((cert) => (
            <span key={cert.code} className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-azure-light" aria-hidden="true" />
              {cert.label} <span className="font-mono text-white/80">{cert.code}</span>
            </span>
          ))}
          <span className="ml-auto">{chrome.supervision}</span>
          <span>{chrome.listed}</span>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-[13px] text-white/55">
          <p>{chrome.legal}</p>
          <a href="#" className="hover:text-white">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  )
}
