import { MessageCircle } from 'lucide-react'

/** Botón flotante de contacto, como en el sitio original. */
export function WhatsappFab() {
  return (
    <a
      href="#contacto"
      aria-label="Contáctenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  )
}
