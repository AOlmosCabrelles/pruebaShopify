# Guía del simulacro: Vigor Manager

Guía paso a paso para desarrollar una app de Shopify para una tienda de suplementación
deportiva usando **Shopify CLI**, **Visual Studio Code** y **GitHub**.

> Todo lo que aparece aquí ya está implementado en este repositorio. Puedes seguir la
> guía de dos formas:
> - **Modo lectura:** clonas el repo, lo arrancas y recorres el código fase por fase.
> - **Modo práctica:** creas tu propia app desde cero (`shopify app init`) y usas este repo como solución.

---

## Índice

0. [Preparar el equipo](#fase-0--preparar-el-equipo)
1. [Cuenta de Shopify y tienda de desarrollo](#fase-1--cuenta-de-shopify-y-tienda-de-desarrollo)
2. [Repositorio en GitHub y VS Code](#fase-2--repositorio-en-github-y-vs-code)
3. [Arrancar la app](#fase-3--arrancar-la-app)
4. [Catálogo de suplementos de prueba](#fase-4--catálogo-de-suplementos-de-prueba)
5. [Lotes y caducidad (base de datos + Admin API)](#fase-5--lotes-y-caducidad)
6. [Calculadora de proteína (theme app extension)](#fase-6--calculadora-de-proteína-en-la-tienda)
7. [Pack proteína + creatina (Shopify Function)](#fase-7--pack-proteína--creatina-shopify-function)
8. [CI/CD con GitHub Actions y despliegue](#fase-8--cicd-y-despliegue)
9. [Publicación y aspectos legales](#fase-9--publicación-y-aspectos-legales)

---

## Fase 0 · Preparar el equipo

1. Instala **Node.js 22** (≥ 22.12): https://nodejs.org
2. Instala **Git**: https://git-scm.com
3. Instala **Visual Studio Code**: https://code.visualstudio.com
4. Instala la **Shopify CLI**:
   ```bash
   npm install -g @shopify/cli@latest
   ```
5. Comprueba que todo responde:
   ```bash
   node -v
   ```
   ```bash
   shopify version
   ```

## Fase 1 · Cuenta de Shopify y tienda de desarrollo

1. Crea una cuenta de desarrollador gratuita en https://shopify.dev → *Get started*.
2. En el **Dev Dashboard**, crea una **tienda de desarrollo**:
   - Nombre: `vigor-sport-dev`
   - Es gratis, no procesa pagos reales y sirve para probar.
3. No hace falta crear la app a mano: la CLI lo hace en la fase 3.

## Fase 2 · Repositorio en GitHub y VS Code

### 2.1 Clonar el repositorio en VS Code
1. Abre VS Code → `Ctrl + Shift + P` → **Git: Clone**.
2. Pega la URL del repositorio (botón verde **Code** en GitHub) y elige una carpeta.
3. Pulsa **Abrir** cuando termine.
4. Aparecerá un aviso: *"Este repositorio recomienda extensiones"* → **Instalar todas**.
   Las define `.vscode/extensions.json`: GraphQL, Prisma, ESLint, Prettier,
   GitHub Pull Requests, GitHub Actions, GitLens, Shopify Liquid, Vitest y DotENV.

### 2.2 Qué hay en `.vscode/`
| Archivo | Para qué |
|---|---|
| `extensions.json` | Extensiones recomendadas para el equipo |
| `settings.json` | Formateo al guardar, ESLint, protección de `main` (VS Code te obliga a crear rama) |
| `tasks.json` | Tareas con un clic: `Ctrl + Shift + P` → **Tasks: Run Task** |
| `launch.json` | Depuración con `F5` |

### 2.3 Proteger `main` en GitHub
En GitHub → **Settings → Branches → Add branch ruleset** (o *Add rule*):
- Rama: `main`
- ✅ *Require a pull request before merging*
- ✅ *Require status checks to pass* → elige **Lint, tipos, tests y build**

### 2.4 Crear las issues
Copia el backlog de [`docs/BACKLOG.md`](BACKLOG.md) como issues. Hay plantillas en
`.github/ISSUE_TEMPLATE/` (Nueva funcionalidad / Error).

## Fase 3 · Arrancar la app

En la terminal integrada de VS Code (`` Ctrl + ` ``):

```bash
npm install
```
```bash
npm run dev
```

La primera vez la CLI:
1. Te pide **iniciar sesión** en Shopify (se abre el navegador).
2. Pregunta si quieres **crear una app nueva** → *Sí* → nombre `Vigor Manager`.
3. Te deja elegir la **tienda de desarrollo** → `vigor-sport-dev`.
4. Rellena `client_id` en `shopify.app.toml`. Haz commit de ese cambio, porque no es secreto.
5. Abre un túnel y arranca el servidor. Pulsa **`p`** para abrir la app en el admin.

Atajos de la terminal mientras corre `shopify app dev`:
| Tecla | Acción |
|---|---|
| `p` | Abrir la app en el admin |
| `g` | Abrir **GraphiQL** para probar consultas a la Admin API |
| `q` | Parar |

**Depurar:** usa `F5` → **Depurar Shopify app dev**, pon un punto de interrupción
(clic a la izquierda del número de línea) en el `loader` de `app/routes/app._index.tsx` y
recarga la app.

## Fase 4 · Catálogo de suplementos de prueba

**Rama:** `feature/seed-catalogo` · **Archivos:** `app/data/catalogo.server.ts`,
`app/services/catalogo.server.ts`, `app/routes/app.catalogo.tsx`

En la app → **Catálogo de prueba → Cargar catálogo en la tienda**. Se crea:

| Producto | Tipo | Variantes |
|---|---|---|
| Whey Protein Isolate | Proteína | 3 sabores × 1 kg / 2 kg |
| Creatina Monohidrato | Creatina | 300 g / 500 g |
| Pre-Entreno Explosive | Pre-entreno | Limón / Frutos rojos |
| BCAA 2:1:1 | Aminoácidos | Mango / Neutro |
| Multivitamínico Sport | Vitaminas | 90 cápsulas |
| Barritas proteicas (caja de 12) | Snack | Cookies / Cacahuete |

También se crea lo siguiente:
- **Metafields** `nutricion.*`: proteína por dosis, tamaño de dosis, alérgenos, modo de empleo y gramos del envase (por variante).
- **Colecciones**: Proteínas, Rendimiento, Recuperación, Salud y Snacks.
- **Stock** en la ubicación principal. Algunas variantes tienen muy poco stock a propósito.
- **Lotes** con caducidades variadas. Algunos caducan pronto a propósito.

Qué aprendes en esta fase:
- Mutaciones de la Admin API: `metafieldDefinitionCreate`, `productSet` (idempotente por `handle`), `collectionCreate`, `collectionAddProducts` y `publishablePublish`.
- **Scopes**: por eso `shopify.app.toml` pide `write_products`, `write_inventory`, `read_locations` y `write_publications`. Si los cambias, la CLI te pedirá volver a aceptar permisos.
- **Tipos generados:** escribe una consulta dentro de `` `#graphql ...` ``, ejecuta la tarea
  **GraphQL: generar tipos** y la respuesta queda tipada (`app/types/admin.generated.d.ts`).
  La extensión GraphQL de VS Code autocompleta los campos con `Ctrl + Espacio`.

## Fase 5 · Lotes y caducidad

**Ramas:** `feature/lotes-caducidad`, `feature/alta-lotes`

1. **Modelo de datos** (`prisma/schema.prisma`): modelos `Lote` y `Ajustes`.
   Para crear una migración nueva, usa la tarea **Prisma: nueva migración** o:
   ```bash
   npx prisma migrate dev --name lotes_y_ajustes
   ```
2. **Panel** (`app/routes/app._index.tsx`):
   - Lotes que caducan antes de N días, leídos de la base de datos.
   - Variantes con stock bajo, consultadas a la Admin API con `productVariants(query: "inventory_quantity:<10")`.
3. **Alta y baja de lotes** (`app/routes/app.lotes.tsx`): formulario con `<Form method="post">` y una `action`.
4. **Ajustes** (`app/routes/app.ajustes.tsx`): umbral de stock y días de aviso.
5. Para ver la base de datos, ejecuta la tarea **Prisma: Studio**.

## Fase 6 · Calculadora de proteína en la tienda

**Rama:** `feature/calculadora` · **Carpeta:** `extensions/calculadora-proteina/`

Es una *theme app extension* con dos bloques:
- **Calculadora de proteína:** el cliente indica su peso y su objetivo, y el bloque calcula los gramos al día, las dosis y cuántos días le dura el envase de la variante elegida. Solo aparece si el producto tiene proteína.
- **Información nutricional:** muestra la proteína y el tamaño de la dosis, los alérgenos (en negrita) y el modo de empleo.

Para añadir los bloques a la tienda:
1. Con `npm run dev` en marcha, ve a **Tienda online → Temas → Personalizar**.
2. Cambia a la plantilla **Productos**.
3. En la sección de información del producto: **Añadir bloque → Aplicaciones → Calculadora de proteína** (y luego **Información nutricional**).
4. Guarda y abre la ficha de *Whey Protein Isolate* en la tienda.

Para crear tu propia extensión desde cero, en modo práctica:
```bash
shopify app generate extension --template theme_app_extension --name calculadora-proteina
```

## Fase 7 · Pack proteína + creatina (Shopify Function)

**Rama:** `feature/pack-descuento` · **Carpeta:** `extensions/pack-proteina-creatina/`

- `src/cart_lines_discounts_generate_run.graphql`: los datos del carrito que recibe la función (el tipo de producto de cada línea y la configuración del descuento).
- `src/cart_lines_discounts_generate_run.js`: si hay Proteína **y** Creatina en el carrito, aplica un X % a esas líneas.
- `tests/pack.test.js`: tests con Vitest. Ejecútalos con `npm test` o desde el panel *Testing* de VS Code.

Para activarlo:
1. Con `npm run dev` en marcha, la función se despliega en la tienda de desarrollo.
2. En la app → **Pack proteína + creatina → Activar descuento**. Esto llama a `discountAutomaticAppCreate` con el `functionHandle`.
3. Prueba en la tienda: añade Whey + Creatina al carrito y verás el descuento en el checkout.
4. Cambia el porcentaje desde la misma pantalla. Se guarda en un metafield `$app:config` que la función lee.

## Fase 8 · CI/CD y despliegue

### 8.1 Flujo de trabajo diario (todo desde VS Code)
```
1. Abajo a la izquierda: rama main → "Create new branch" → feature/xxx
2. npm run dev → programar → probar en la tienda de desarrollo
3. Ctrl+Shift+G → revisar los cambios → mensaje → Commit → Publish Branch
4. Panel GitHub → "Create Pull Request" (se rellena con .github/pull_request_template.md)
5. La CI se ejecuta → la ves en el panel "GitHub Actions" de VS Code
6. CI en verde + revisión → Merge → se ejecuta el workflow Deploy
7. Volver a main → Sync → siguiente issue
```

Antes de subir, ejecuta la tarea **Comprobar todo (como la CI)** (`npm run check`).

### 8.2 Workflows incluidos
| Archivo | Cuándo | Qué hace |
|---|---|---|
| `.github/workflows/ci.yml` | Cada PR y cada push a `main` | Prisma, ESLint, TypeScript, tests de la Function y build |
| `.github/workflows/deploy.yml` | Merge en `main` o a mano | 1) Imagen Docker del backend → `ghcr.io/<usuario>/<repo>`; 2) `shopify app deploy` (si está activado) |
| `.github/dependabot.yml` | Semanal | PRs para actualizar dependencias |

### 8.3 Activar el despliegue en Shopify
1. Genera un **token de la CLI** para CI/CD desde tu panel de Shopify (busca "CLI token" o
   "automation token" en la documentación de *Deploy app components in a CD pipeline*).
2. En GitHub → **Settings → Secrets and variables → Actions**:
   - **Secrets** → `SHOPIFY_CLI_PARTNERS_TOKEN` (o `SHOPIFY_APP_AUTOMATION_TOKEN`, según el panel).
   - **Variables** → `SHOPIFY_DEPLOY` = `true`.
3. **Settings → Environments → production**: opcionalmente, exige una aprobación manual.

### 8.4 Desplegar el backend
El workflow publica la imagen Docker en GitHub Container Registry. En tu hosting:
1. Crea un servicio a partir de la imagen `ghcr.io/aolmoscabrelles/pruebashopify:latest`
   (o conecta el repo y usa el `Dockerfile`).
2. Configura las variables de `.env.example` (el secreto **solo** en el hosting).
3. Pon la URL pública del hosting como `application_url` (y en `[auth] redirect_urls`) de `shopify.app.toml`. La CLI añade estas claves la primera vez que enlazas la app. Después ejecuta `npm run deploy`.
4. Para producción real, cambia SQLite por Postgres (issue #11 del backlog).

### 8.5 Versiones
Cuando una versión esté lista: GitHub → **Releases → Draft a new release** → tag `v1.0.0`.

## Fase 9 · Publicación y aspectos legales

### Si fuese una app pública (App Store)
- [ ] Webhooks RGPD funcionando (ya están en `app/routes/webhooks.*.tsx`)
- [ ] Política de privacidad y ficha de la App Store (icono, capturas, descripción)
- [ ] Facturación con la Billing API, si se cobra
- [ ] Instalar y desinstalar sin errores
- [ ] Enviar a revisión desde el panel

### Suplementos: normativa a tener en cuenta (UE)
- **Etiquetado (Reglamento 1169/2011):** la información nutricional y los alérgenos tienen que verse antes de comprar. Para eso existe el bloque *Información nutricional*.
- **Declaraciones de propiedades saludables (Reglamento 1924/2006):** solo se pueden usar las autorizadas. Los textos del catálogo de ejemplo usan declaraciones de ese tipo, como la de la creatina (3 g/día) o la de la vitamina C. Nada de "cura" o "previene".
- **Calculadora:** muestra el aviso *"Cálculo orientativo. No sustituye el consejo de un profesional sanitario."*
- **Cafeína:** el pre-entreno lleva la advertencia de que no se recomienda a niños ni embarazadas.
- **Políticas de Shopify y de las pasarelas de pago:** algunos ingredientes están restringidos. Revísalas antes de vender.

---

## Calendario propuesto (5 días)

| Día | Tareas |
|---|---|
| 1 | Fases 0-3: entorno, tienda de desarrollo, repo, VS Code, `npm run dev` |
| 2 | Fase 4: catálogo de prueba → primer PR con CI en verde |
| 3 | Fase 5: lotes, caducidades y ajustes |
| 4 | Fases 6-7: calculadora en la tienda y pack de descuento en el checkout |
| 5 | Fases 8-9: deploy, release `v1.0.0` y checklist de publicación; empezar los retos del backlog |
