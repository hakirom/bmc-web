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
| `/boletines/:slug` | Artículo completo de un boletín |

`vercel.json` reescribe todas las rutas a `index.html`; sin eso, recargar en `/portal`
devolvería 404.

## Tema claro y oscuro

El interruptor está en la barra superior (y en la cabecera en móvil). Respeta la
preferencia del sistema mientras el usuario no elija; en cuanto elige, se guarda en
`localStorage` y manda sobre el sistema.

No hay variantes `dark:` repartidas por los componentes: `src/styles/globals.css`
redefine los **tokens de color** bajo `:root.oscuro`, así que cada componente sigue
usando `bg-surface`, `text-heading` o `border-line` sin saber en qué tema está.

Dos tokens tienen el papel separado a propósito: `navy` es el color institucional de
fondo (cabecera y pie siguen siendo azul oscuro en ambos temas), mientras que `surface`
y `heading` son los que cambian.

## Botones y panel de indicadores

Los CTA del hero y del tablero son **enlaces del CMS**: etiqueta y destino se editan en
Home. Por defecto el principal lleva al portal y el secundario al acceso, pero se cambian
sin tocar código. Rutas internas (`/portal`) usan el enrutador; anclas y destinos externos
se resuelven como enlace normal.

La franja de cifras es un **panel embebido que simula un informe de Power BI**: marco
propio, barra con el origen y la marca de actualización, indicadores con tendencia y barra
de progreso. Los datos salen del CMS y no hay ninguna llamada externa; para conectar el
informe real basta con sustituir el contenido del marco por su iframe.

## De dónde sale el contenido

- `src/lib/cms.ts` — cliente REST; mapea la respuesta de Strapi a las formas que usa la UI.
- `src/lib/content-context.tsx` — carga el contenido en el idioma activo y **cae al
  contenido local** si el CMS no responde (el badge inferior izquierdo lo indica).

### Tolerancia al desajuste de versiones

El front y el CMS se despliegan por separado, así que uno puede ir por delante del otro.
Para que eso no rompa la página:

- **Cada recurso se pide por separado.** Que falle uno degrada solo esa sección, no la
  portada entera.
- **Cada petición reintenta con una consulta más simple.** Si un `populate` menciona un
  campo que el CMS todavía no tiene, Strapi responde `400 Invalid key`; se reintenta con
  `populate=*` y luego sin populate.
- **Los campos que cambiaron de tipo se aceptan en ambas formas.** Los CTA eran texto y
  ahora son enlaces: si llega texto, se usa como etiqueta con el destino por defecto.
- **Las listas vacías usan el respaldo.** Un tablero o un carrusel en blanco parecen un
  fallo; es preferible mostrar el contenido local.

Aun así, **despliegue primero el CMS y después el front** cuando un cambio toque a los
dos: la tolerancia evita el error, no sustituye al contenido nuevo.
- `src/data/site.ts` y `src/data/ui.ts` — respaldo sin conexión. **No son la fuente**:
  todo el contenido editable vive en el CMS.
- `src/components/metadatos.tsx` — lleva al documento el título, la descripción y las
  palabras clave que se editan en **Home → SEO**, y el `lang` según el idioma activo. El
  `index.html` solo aporta el valor inicial para el primer pintado.

## Despliegue

### AWS Amplify Hosting

`amplify.yml` ya define la compilación, así que Amplify no pregunta nada al conectar el
repositorio. Después hay que añadir a mano dos cosas en la consola:

1. **Rewrites and redirects** → una regla `/<*>` → `/index.html` de tipo **200 (Rewrite)**.
   Sin ella, entrar directo a `/portal` o `/boletines/...` devuelve 404: Amplify no
   deduce solo que esto es una SPA.
2. **Environment variables** → `VITE_CMS_URL` con la URL del CMS. Vite la incrusta al
   compilar, así que hay que volver a desplegar tras cambiarla.

### Vercel

Importe el repositorio y despliegue: Vercel detecta Vite y usa el `vercel.json` del repo.
Defina `VITE_CMS_URL` en **Settings → Environment Variables** y vuelva a desplegar.
