/**
 * Renderiza el texto enriquecido del campo `contenido` de Strapi (tipo blocks).
 * Solo se cubren los bloques que produce el redactor y los que un editor usa
 * habitualmente; cualquier otro se ignora en vez de romper la página.
 */

type Hijo = { type: string; text?: string; bold?: boolean; italic?: boolean; url?: string; children?: Hijo[] }
export type Bloque = { type: string; level?: number; format?: string; children?: Hijo[] }

function Texto({ hijos }: { hijos: Hijo[] }) {
  return (
    <>
      {hijos.map((hijo, i) => {
        if (hijo.type === 'link' && hijo.url) {
          return (
            <a key={i} href={hijo.url} className="text-azure underline underline-offset-2">
              <Texto hijos={hijo.children ?? []} />
            </a>
          )
        }

        const contenido = hijo.text ?? ''
        if (hijo.bold) return <strong key={i}>{contenido}</strong>
        if (hijo.italic) return <em key={i}>{contenido}</em>
        return <span key={i}>{contenido}</span>
      })}
    </>
  )
}

export function Bloques({ bloques }: { bloques: Bloque[] }) {
  return (
    <>
      {bloques.map((bloque, i) => {
        const hijos = bloque.children ?? []

        switch (bloque.type) {
          case 'heading':
            return bloque.level === 3 ? (
              <h3 key={i} className="mt-8 text-lg font-bold text-heading">
                <Texto hijos={hijos} />
              </h3>
            ) : (
              <h2 key={i} className="mt-10 text-xl font-bold text-heading">
                <Texto hijos={hijos} />
              </h2>
            )

          case 'list':
            return (
              <ul key={i} className="mt-4 space-y-2 pl-5">
                {hijos.map((item, j) => (
                  <li key={j} className="list-disc text-ink marker:text-azure">
                    <Texto hijos={item.children ?? []} />
                  </li>
                ))}
              </ul>
            )

          case 'quote':
            return (
              <blockquote key={i} className="mt-6 border-l-4 border-azure bg-tint px-5 py-3 italic text-ink">
                <Texto hijos={hijos} />
              </blockquote>
            )

          case 'paragraph':
            return (
              <p key={i} className="mt-4 leading-relaxed text-ink">
                <Texto hijos={hijos} />
              </p>
            )

          default:
            return null
        }
      })}
    </>
  )
}
