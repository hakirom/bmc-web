import { cn } from '@/lib/utils'
import { useReveal } from '@/lib/use-reveal'

type Props = {
  eyebrow?: string
  title?: string
  intro?: string
  dark?: boolean
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = 'left',
  className,
}: Props) {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <div
      ref={reveal.ref}
      style={reveal.style}
      className={cn(reveal.className, 'max-w-3xl', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow ? (
        <p
          className={cn(
            'text-xs font-bold uppercase tracking-[0.2em]',
            dark ? 'text-azure-light' : 'text-azure',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2
          className={cn(
            'mt-3 text-balance text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-[34px]',
            dark ? 'text-white' : 'text-navy',
          )}
        >
          {title}
        </h2>
      ) : null}
      {intro ? (
        <p className={cn('mt-4 text-base leading-relaxed', dark ? 'text-white/75' : 'text-muted')}>
          {intro}
        </p>
      ) : null}
      <span
        className={cn(
          'mt-6 block h-1 w-16 rounded-full',
          align === 'center' && 'mx-auto',
          dark ? 'bg-azure-light' : 'bg-azure',
        )}
        aria-hidden="true"
      />
    </div>
  )
}
