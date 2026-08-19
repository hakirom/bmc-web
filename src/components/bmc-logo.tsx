import { cn } from '@/lib/utils'

/** Marca BMC dibujada inline (rueda + wordmark), sin descargar assets del sitio. */
export function BmcLogo({ className, dark = false }: { className?: string; dark?: boolean }) {
  const fg = dark ? '#ffffff' : '#013365'

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="17" r="12.5" stroke={fg} strokeWidth="1.6" />
        <g stroke={fg} strokeWidth="0.9" opacity="0.85">
          <path d="M20 4.5v25M7.5 17h25M11.2 8.2l17.6 17.6M28.8 8.2 11.2 25.8" />
        </g>
        <circle cx="20" cy="17" r="4.6" fill={fg} />
        <text
          x="20"
          y="38"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={fg}
          fontFamily="inherit"
        >
          BMC
        </text>
      </svg>
      <span className={cn('text-[10px] font-semibold uppercase leading-[1.25] tracking-[0.08em]', dark ? 'text-white' : 'text-navy')}>
        Bolsa
        <br />
        Mercantil
        <br />
        de Colombia
      </span>
    </span>
  )
}
