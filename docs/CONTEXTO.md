# Contexto del proyecto (para retomar el trabajo)

Resumen del estado, las decisiones tomadas y lo aprendido. Pensado para una sesión nueva de Claude
o para otro mantenedor: **leer esto primero**, luego el `README.md` de cada rama.

*Última actualización: 13/11/2026.*

---

## 1. Qué es

Tienda Shopify de suplementación deportiva para una **marca ficticia, "Vigor Sport Nutrition"**
(simulacro de proyecto real). **Sin apps**: todo con Shopify estándar y un tema propio.

- **Tienda de pruebas:** `vigor-sport-dev.myshopify.com` (tienda de desarrollo).
- **Repositorio:** GitHub `AOlmosCabrelles/pruebaShopify` (público). Preparado para transferirse
  a otro propietario (`docs/TRANSFERENCIA.md`).
- **Idioma de trabajo:** español (textos, commits, documentación).

## 2. Estructura

| Rama | Contenido |
|---|---|
| `main` | `tienda/` (CSV, catálogo, imágenes, scripts, `GUIA-TIENDA.md`), `docs/` |
| `tema-horizon` | El tema: **Horizon 4.5.0** de Shopify adaptado. Conectado a la tienda con la integración de GitHub (sincroniza en los dos sentidos) |

Shopify exige el tema en la raíz de la rama conectada: por eso son dos ramas (decisión confirmada
por el propietario; no unificar).

## 3. Decisiones tomadas (y por qué)

| Decisión | Motivo |
|---|---|
| **Sin apps.** La app "Vigor Manager" (React Router) se creó al principio y **se eliminó** | El propietario solo quiere la web. El código sigue en el historial de git |
| **Estilo "agresivo"**: modo oscuro `#0B0B0B`, acento rojo fuego `#FF3D00`, títulos en **Anton** (OFL, en `assets/vigor-anton.woff2`), esquinas rectas, cortes diagonales, cinta animada | Petición expresa: aspecto de web de suplementación |
| **Colecciones automáticas por etiqueta** `cat-proteinas`, `cat-rendimiento`, `cat-recuperacion`, `cat-salud`, `cat-snacks`, `cat-accesorios` | Sin tildes ni mayúsculas para evitar errores al escribir la condición. Identificadores (handles) de colección: `proteinas`, `rendimiento`… (el tema los usa para colores e imágenes) |
| **Fotos de producto = ilustraciones de envases Vigor** (generadas por script, fondo oscuro) + **segunda foto de ambiente** real de banco de imágenes | No hay producto real; no usar fotos de otras marcas (ni quitándoles el logo: se rechazó por legal y calidad) |
| **Fotos reales de banco de imágenes** (Openverse: CC0, CC BY, CC BY-SA) en banner, categorías, cabeceras de colección y "Sobre nosotros", retocadas con el estilo de la marca | Aspecto profesional. **CC BY obliga a citar al autor**: créditos en desplegable del pie (`snippets/vigor-creditos-imagenes.liquid`) |
| **Shopify manda en los productos** una vez la tienda está en marcha. El CSV es carga inicial, no sincronización | Reimportar el CSV completo pisaría precios, textos y **stock** |
| **Sin usuario fijado en el código**: `tienda/lib/repo.mjs` detecta el repositorio del remoto git | Facilitar la transferencia a otro mantenedor |

## 4. Qué tiene el tema (`tema-horizon`)

Secciones propias `sections/vigor-*.liquid`, estilos en `assets/vigor.css`, variables en
`snippets/vigor-variables.liquid`:
banner, cinta, beneficios, categorías, "¿Cuál es tu objetivo?", **cuestionario "Encuentra tu
suplemento"**, "Tu día con Vigor", imagen y texto, calculadora de proteína, FAQ, newsletter,
cabecera de colección (foto de fondo), página de categorías (`/collections`), pie propio con
créditos, **barra de envío gratis en el carrito** (importe en *Configuración del tema → Vigor · Tienda*).

Archivos **originales de Horizon modificados** (revisar si se actualiza Horizon): lista en el
README de la rama `tema-horizon`.

## 5. Qué hay en `main`

- `tienda/catalogo.mjs`: **fuente única** del catálogo (21 productos, 41 variantes).
- `npm run csv` → `productos-vigor.csv` (completo) y `productos-vigor-imagenes.csv` (solo fotos).
- `tienda/generar-csv.mjs`: opciones `--solo`, `--sin-stock`, `--solo-imagenes`, `--desde-shopify`.
- `npm run sincronizar -- export.csv`: lee una **exportación de Shopify** → copia + `INFORME.md`
  (errores, cambios, stock bajo).
- `npm run imagenes`: fotos de producto; usa fotos reales de `tienda/imagenes/recortes/` si existen
  (ahora hay **2 fotos de EJEMPLO** ahí, marcadas en su README).
- `npm run fotos-banco`: retoque de fotos de banco + créditos (`tienda/imagenes/banco/`).
- `tienda/herramientas/validar-ajustes-tema.py <carpeta-tema>`: valida ajustes del tema.
- GitHub Actions: comprueba que los CSV están al día con el catálogo.

## 6. Pendiente (lo hace el propietario en Shopify)

- [ ] **Idioma predeterminado de la tienda → Español** (*Configuración → Idiomas*). La tienda parece
      estar en inglés: por eso salían "Home/Catalog/Contact" y etiquetas en inglés. Textos sueltos
      restantes: app gratuita **Translate & Adapt**
- [ ] Comprobar que el pie muestra **"Créditos de imágenes"** (si no, revisar errores de
      sincronización del tema en *Tienda online → Temas*)
- [ ] Importar **`productos-vigor-imagenes.csv`** con *Sobrescribir* (fotos oscuras + fotos de ambiente).
      Probar antes con un producto: ver si Shopify **sustituye o añade** imágenes
- [ ] Colecciones creadas con condición por etiqueta (el propietario ya creó colecciones; confirmar
      que se rellenan)
- [ ] Menú principal: el propietario lo creó; si la cabecera no lo muestra, elegirlo en el bloque
      *Menú* de la cabecera
- [ ] Ajustar el email de contacto del pie (ahora `hola@vigorsport.example`) y redes sociales

## 7. Lecciones aprendidas (¡importante!)

- **Shopify rechaza en silencio los archivos JSON del tema con valores no válidos** al sincronizar
  desde GitHub (p. ej. una opción de `select` que no existe). Pasó con la barra de anuncios.
  **Siempre ejecutar `validar-ajustes-tema.py` y `shopify theme check` antes de subir** a `tema-horizon`.
- Los nombres de secciones (`"name"` del schema) tienen **máximo 25 caracteres**.
- Anton tiene un solo peso: usar `font-weight: 400` (si no, negrita falsa).
- **No reimportar el CSV completo** en una tienda con ventas (restablece el stock).
- Las imágenes del CSV se sirven desde `raw.githubusercontent.com`: si el repositorio pasa a privado,
  las **futuras** importaciones con imágenes fallan.
- La conexión Shopify ↔ GitHub va ligada a la **cuenta de GitHub que la autoriza**: al transferir el
  repositorio hay que reconectar el tema.
- Varios menús del admin de Shopify han cambiado de sitio: **menús y páginas** están en *Contenido*
  (o URL directa `admin.shopify.com/store/<tienda>/pages`); las **colecciones automáticas** se crean con
  *+ Agregar condición* (ya no hay selector Manual/Automatizada).
- Para no pisar cambios del editor de temas: hacer `git pull` en `tema-horizon` antes de tocarla.
- **`all_products` en Liquid no es fiable** (límite de 20 productos por página y vuelve vacío sin avisar).
  El cuestionario pide los que falten con `/products/<handle>.js` desde el navegador.

## 8. Notas para Claude (sesiones en la nube)

- Entorno de trabajo **"pruebaShopify"** (personal, de la cuenta del propietario): permite
  `api.openverse.org`, `upload.wikimedia.org`, `live.staticflickr.com`, `images.rawpixel.com`.
  Openverse da errores 504 a menudo: reintentar despacio. Flickr limita (429): descargar con
  `https://api.openverse.org/v1/images/<id>/thumb/?full_size=true&compressed=false`.
- El `fetch` de Node no usa el proxy del entorno: para llamadas HTTP usar `curl`.
- `shopify theme check`: `npx --yes @shopify/cli@5 theme check --path <tema>`.
- Antes de cada cambio de tema: validar (punto 7) y hacer vistas previas aproximadas con Playwright
  (las secciones propias se pueden maquetar fuera de Shopify con `assets/vigor.css`).
- El propietario prefiere: explicaciones paso a paso en español, sin tecnicismos innecesarios, y que
  se le pregunte cuando algo es ambiguo.
