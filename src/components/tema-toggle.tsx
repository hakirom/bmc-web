import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContent } from '@/lib/content-context'
import { useTema } from '@/lib/theme'

/** Interruptor de tema claro/oscuro. Las etiquetas vienen del CMS. */
export function TemaToggle({ className }: { className?: string }) {
  const { ui: t } = useContent()
  const { tema, alternar } = useTema()
  const esOscuro = tema === 'oscuro'

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={t.cambiarTema}
      title={esOscuro ? t.temaClaro : t.temaOscuro}
      aria-pressed={esOscuro}
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-2 py-1 transition-colors hover:bg-white/10',
        className,
      )}
    >
      {esOscuro ? (
        <Sun size={15} aria-hidden="true" />
      ) : (
        <Moon size={15} aria-hidden="true" />
      )}
      <span className="sr-only">{esOscuro ? t.temaClaro : t.temaOscuro}</span>
    </button>
  )
}
