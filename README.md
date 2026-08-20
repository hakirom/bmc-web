# BMC Web — front-end

Front-end de la demo de la Bolsa Mercantil de Colombia. Vite 6 + React 19 +
TypeScript + Tailwind CSS v4. Consume la API REST del CMS
([bmc-cms](https://github.com/hakirom/bmc-cms)).

> ⚠️ **Demo no oficial.** No está afiliada ni respaldada por la Bolsa Mercantil de
> Colombia S.A. Las cifras del tablero son simuladas.

## Arranque

```bash
npm install
cp .env.example .env      # apunte VITE_CMS_URL a su CMS
npm run dev               # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve el build |
| `npm run typecheck` | TypeScript sin emitir |

## Configuración

`VITE_CMS_URL` — URL del CMS (por defecto `http://localhost:1337`).

Vite **incrusta la variable al compilar**, no la lee en ejecución: tras cambiarla hay que
volver a compilar o desplegar.

## Rutas

| Ruta | Qué hay |
|---|---|
| `/` | Portada pública |
| `/acceso` | Inicio de sesión y registro contra el CMS |
| `/portal` | Portal privado con los componentes activos del CMS |
| `/pqrsf` | Asistente que radica peticiones, quejas y reclamos |

`vercel.json` reescribe todas las rutas a `index.html`; sin eso, recargar en `/portal`
devolvería 404.

## De dónde sale el contenido

- `src/lib/cms.ts` — cliente REST; mapea la respuesta de Strapi a las formas que usa la UI.
- `src/lib/content-context.tsx` — carga el contenido en el idioma activo y **cae al
  contenido local** si el CMS no responde (el badge inferior izquierdo lo indica).
- `src/data/site.ts` y `src/data/ui.ts` — respaldo sin conexión. **No son la fuente**:
  todo el contenido editable vive en el CMS.

## Despliegue en Vercel

Importe el repositorio y despliegue: Vercel detecta Vite y usa el `vercel.json` del repo.
Defina `VITE_CMS_URL` en **Settings → Environment Variables** y vuelva a desplegar.
