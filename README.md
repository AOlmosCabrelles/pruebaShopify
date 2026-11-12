# Vigor Sport Nutrition · simulacro de tienda Shopify

> 🛒 **¿Solo quieres montar la tienda, sin programar?** Empieza por
> **[tienda/GUIA-TIENDA.md](tienda/GUIA-TIENDA.md)**: creación de la tienda, elección del tema,
> catálogo e inventario de ejemplo (`tienda/productos-vigor.csv`) y textos listos para copiar.
>
> El resto del repositorio es una app opcional (*Vigor Manager*) para más adelante.

---

## Vigor Manager (app opcional)

App de Shopify de ejemplo para una tienda **ficticia** de suplementación deportiva,
*Vigor Sport Nutrition*. Es un proyecto de práctica (simulacro) para aprender el flujo
completo de desarrollo: **Shopify CLI + Visual Studio Code + GitHub**.

> 📘 La guía paso a paso está en **[docs/GUIA-SIMULACRO.md](docs/GUIA-SIMULACRO.md)**
> y el backlog (issues para crear en GitHub) en **[docs/BACKLOG.md](docs/BACKLOG.md)**.

## Qué hace

| Funcionalidad | Dónde | Código |
|---|---|---|
| Panel de **lotes que caducan** y **stock bajo** | Admin de Shopify | `app/routes/app._index.tsx` |
| Alta y baja de **lotes con fecha de caducidad** | Admin | `app/routes/app.lotes.tsx` |
| **Catálogo de prueba** (6 suplementos, variantes, stock, metafields, colecciones, lotes) | Admin | `app/routes/app.catalogo.tsx`, `app/data/catalogo.server.ts` |
| **Calculadora de proteína** + **información nutricional** en la ficha de producto | Tienda online | `extensions/calculadora-proteina/` |
| **Descuento automático "Pack proteína + creatina"** | Checkout | `extensions/pack-proteina-creatina/` (Shopify Function) + `app/routes/app.promociones.tsx` |
| Umbrales configurables | Admin | `app/routes/app.ajustes.tsx` |
| Webhooks de desinstalación y RGPD | Backend | `app/routes/webhooks.*.tsx` |

## Tecnología

- [React Router 7](https://reactrouter.com/), la plantilla oficial de apps de Shopify
- Polaris web components (`<s-page>`, `<s-table>`…) y App Bridge
- Admin GraphQL API `2026-10` con tipos generados (`app/types/`)
- Prisma + SQLite en desarrollo (modelos `Session`, `Lote` y `Ajustes`)
- Theme app extension (Liquid + JS) y Shopify Function (JavaScript → Wasm)
- GitHub Actions: CI en cada PR y deploy al fusionar en `main`

## Arranque rápido

Requisitos: Node.js ≥ 22.12, Git, una cuenta de desarrollador de Shopify y una tienda de desarrollo.

```bash
npm install -g @shopify/cli@latest
```
```bash
git clone https://github.com/AOlmosCabrelles/pruebaShopify.git
```
```bash
cd pruebaShopify
```
```bash
npm install
```
```bash
npm run dev
```

La primera vez, la CLI te pedirá iniciar sesión, crear o enlazar la app y elegir la tienda
de desarrollo. Pulsa `p` en la terminal para abrir la app y luego ve a **Catálogo de prueba →
Cargar catálogo en la tienda**.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca la app en la tienda de desarrollo (túnel y recarga en caliente) |
| `npm run check` | Lint, tipos, tests y build, lo mismo que la CI |
| `npm test` | Tests de la Shopify Function |
| `npm run graphql-codegen` | Regenera los tipos de las consultas GraphQL |
| `npm run deploy` | Publica la configuración y las extensiones en Shopify |
| `npx prisma studio` | Abre la base de datos en el navegador |

## Estructura

```
app/
├── data/catalogo.server.ts        ← productos de suplementación de ejemplo
├── services/                      ← lógica (carga de catálogo, inventario)
├── routes/
│   ├── app._index.tsx             ← panel
│   ├── app.lotes.tsx              ← lotes y caducidad
│   ├── app.catalogo.tsx           ← cargar catálogo de prueba
│   ├── app.promociones.tsx        ← activar/configurar el pack
│   ├── app.ajustes.tsx            ← umbrales
│   └── webhooks.*.tsx             ← desinstalación y RGPD
└── types/                         ← tipos generados de la Admin API
extensions/
├── calculadora-proteina/          ← bloques de tema (Liquid)
└── pack-proteina-creatina/        ← Shopify Function de descuento + tests
prisma/                            ← esquema y migraciones
.vscode/                           ← extensiones, tareas y depuración recomendadas
.github/                           ← CI, deploy, Dependabot y plantillas de PR/issues
```

---
*Vigor Sport Nutrition es una marca inventada para este simulacro.*
