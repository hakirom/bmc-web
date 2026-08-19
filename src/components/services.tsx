import { ArrowRight, ChevronRight } from 'lucide-react'
import { useContent } from '@/lib/content-context'
import { useReveal } from '@/lib/use-reveal'
import { Icon } from './icon'
import { SectionHeading } from './section-heading'

type ServiceGroup = { title: string; body: string; icon: string; links: string[] }

function ServiceCard({ group, delay }: { group: ServiceGroup; delay: number }) {
  const reveal = useReveal<HTMLElement>(delay)

  return (
    <article
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} flex h-full flex-col rounded-lg border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-azure/50 hover:shadow-[0_20px_45px_-30px_rgba(1,51,101,0.6)]`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-tint text-navy">
        <Icon name={group.icon} size={24} />
      </span>
      <h3 className="mt-4 text-lg font-bold leading-snug text-navy">{group.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{group.body}</p>

      <ul className="mt-5 space-y-1.5 border-t border-line pt-4">
        {group.links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="group flex items-start gap-1.5 text-sm font-semibold text-navy-600 transition-colors hover:text-azure"
            >
              <ChevronRight
                size={15}
                className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
              {link}
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function Services() {
  const { servicesSection } = useContent()

  return (
    <section id="servicios" className="border-b border-line bg-sand py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow={servicesSection.eyebrow}
          title={servicesSection.title}
          intro={servicesSection.intro}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {servicesSection.groups.map((group, i) => (
            <ServiceCard key={group.title} group={group} delay={i * 80} />
          ))}
        </div>

        <a
          href="#"
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
        >
          Ver todos los servicios
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
