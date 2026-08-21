import { MessageCircle } from 'lucide-react'
import { useContent } from '@/lib/content-context'

/** Botón flotante de contacto, como en el sitio original. */
export function WhatsappFab() {
  const { ui: t } = useContent()

  return (
    <a
      href="#contacto"
      aria-label={t.contactoWhatsapp}
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  )
}
