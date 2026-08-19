import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

/**
 * Renderiza un enlace del CMS: usa el enrutador para rutas internas y una
 * etiqueta <a> normal para anclas o destinos externos.
 */
export function EnlaceUi({
  url,
  className,
  children,
}: {
  url: string
  className?: string
  children: ReactNode
}) {
  const esInterno = url.startsWith('/') && !url.startsWith('//')
  const esAncla = url.startsWith('/#')

  if (esInterno && !esAncla) {
    return (
      <Link to={url} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <a href={esAncla ? url.slice(1) : url} className={className}>
      {children}
    </a>
  )
}
