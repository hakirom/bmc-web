import { useContent } from '@/lib/content-context'
import { useReveal } from '@/lib/use-reveal'

export function StatsStrip() {
  const { stats } = useContent()
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section className="bg-navy py-12" aria-label="Cifras BMC">
      <div
        ref={reveal.ref}
        style={reveal.style}
        className={`${reveal.className} container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="border-l-2 border-azure pl-4">
            <p className="text-3xl font-bold tabular-nums text-white lg:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm leading-snug text-white/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
