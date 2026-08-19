# apps/web — Front-end

Vite 6 + React 19 + TypeScript + Tailwind CSS v4. Consume la API REST del CMS en
`apps/cms`. Ver el [README raíz](../../README.md) para el arranque completo.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build
```

## Cómo llegan los datos

- `src/lib/cms.ts` — cliente REST de Strapi; mapea la respuesta a las formas de
  `src/data/site.ts`.
- `src/lib/content-context.tsx` — `ContentProvider` + `useContent()`; hace el fetch una
  vez y cae al contenido local si el CMS falla.
- `src/data/site.ts` — contenido de respaldo y fuente de las partes que aún no están en
  el CMS (menús, footer, barra de utilidades).

Variables: `VITE_CMS_URL` (ver `.env.example`).
