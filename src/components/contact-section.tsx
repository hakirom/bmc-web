import { ArrowRight } from 'lucide-react'
import { useContent } from '@/lib/content-context'
import { useReveal } from '@/lib/use-reveal'
import { Icon } from './icon'
import { SectionHeading } from './section-heading'

type ContactCardData = { title: string; icon: string; links: string[]; cta: string }

function ContactCard({ card, delay }: { card: ContactCardData; delay: number }) {
  const reveal = useReveal<HTMLElement>(delay)

  return (
    <article
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} flex h-full flex-col rounded-lg border border-line bg-white p-6`}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white">
        <Icon name={card.icon} size={20} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-navy">{card.title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        {card.links.map((link) => (
          <li key={link}>{link}</li>
        ))}
      </ul>
      <a
        href="#"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-azure hover:underline"
      >
        {card.cta}
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </article>
  )
}

export function ContactSection() {
  const { contact } = useContent()

  return (
    <section id="contacto" className="bg-tint py-20">
      <div className="container-page">
        <SectionHeading eyebrow={contact.eyebrow} title={contact.title} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {contact.cards.map((card, i) => (
            <ContactCard key={card.title} card={card} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  )
}
