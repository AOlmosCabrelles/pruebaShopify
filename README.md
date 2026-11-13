# Vigor Sport Nutrition · tienda Shopify

Tienda online de suplementación deportiva (marca de ejemplo **Vigor Sport Nutrition**) hecha con
Shopify, sin apps de terceros: tema propio basado en Horizon + catálogo, imágenes y herramientas para
mantenerlo.

> 🧭 **¿Retomas el proyecto?** Lee primero [`docs/CONTEXTO.md`](docs/CONTEXTO.md): estado, decisiones,
> pendientes y lecciones aprendidas.

## Ramas

| Rama | Contenido | Uso |
|---|---|---|
| **`main`** (esta) | Catálogo en CSV, imágenes, scripts y guías | Se importa a mano en Shopify (*Productos → Importar*) |
| **`tema-horizon`** | El tema de la tienda (Horizon adaptado) | Conectada a Shopify: se sincroniza sola en los dos sentidos |

> Shopify exige que el tema esté en la raíz de la rama que se conecta, por eso el tema vive en su
> propia rama. Su README explica cómo conectarlo y qué se ha cambiado sobre Horizon.

## Qué hay en `main`

```
docs/
├── CONTEXTO.md                    ← estado del proyecto, decisiones y pendientes (leer primero)
├── GUIA-TIENDA.md                 ← guía paso a paso: montar, configurar y mantener la tienda
└── TRANSFERENCIA.md               ← cómo pasar el proyecto a otro mantenedor
tienda/
├── catalogo.mjs                   ← fuente de datos del catálogo (de aquí salen los CSV y las fotos)
├── csv/                           ← archivos para importar en Shopify (se generan, no editar a mano)
│   ├── productos-vigor.csv            catálogo completo (21 productos, 41 variantes)
│   ├── productos-vigor-imagenes.csv   solo fotos (no toca precios, textos ni stock)
│   ├── inventario-vigor.csv           stock de ejemplo (Productos → Inventario → Importar)
│   └── ejemplo-fotos-reales.csv       ejemplo con 2 fotos reales de producto
├── scripts/                       ← programas (ver "Uso diario")
│   ├── generar-csv.mjs                genera los CSV de productos (--solo, --sin-stock, --solo-imagenes…)
│   ├── generar-inventario.mjs         genera el CSV de inventario (--ubicacion "…")
│   ├── sincronizar-desde-shopify.mjs  lee una exportación de Shopify: copia + informe de cambios y errores
│   ├── generar-imagenes.mjs           genera las fotos de producto (ilustración o foto real)
│   ├── procesar-fotos-banco.mjs       retoca las fotos de banco con el estilo de la marca
│   ├── validar-ajustes-tema.py        valida los ajustes del tema antes de subir cambios
│   └── lib/                           código compartido (modelo de producto, CSV, repositorio, fotos)
└── imagenes/                      ← las direcciones de estas fotos están en Shopify: no mover
    ├── productos-oscuro/              fotos de producto (envases) que enlaza el CSV
    ├── ambiente/                      segundas fotos de producto (banco de imágenes)
    ├── banco/                         fotos de banco: originales, licencias y CRÉDITOS
    ├── recortes/                      aquí van las fotos reales de producto (ver su README)
    └── marca/                         logo, favicon, imagen de Sobre nosotros y para redes
```

## Uso diario

El día a día (productos, stock, textos, menús, páginas) **se hace desde el admin de Shopify** y no
necesita nada de este repositorio. Las herramientas sirven para cambios masivos, imágenes y
copias de seguridad:

```bash
npm install
```

| Comando | Qué hace |
|---|---|
| `npm run csv` | Regenera los tres CSV de `tienda/csv/` desde `catalogo.mjs` |
| `npm run imagenes` | Regenera las fotos de producto (usa las fotos reales de `recortes/` si existen) |
| `npm run fotos-banco` | Retoca las fotos de banco de imágenes y actualiza los créditos |
| `npm run sincronizar -- export.csv` | Lee una exportación de productos de Shopify: copia de seguridad + informe |
| `npm run validar-tema -- ruta/al/tema` | Valida los ajustes del tema antes de subirlo |
| `npm run comprobar` | Comprueba que los CSV están al día (lo mismo que hace GitHub en cada cambio) |

Requisitos: **Node.js 22+**; para imágenes, **ImageMagick** y el navegador de Playwright
(`npx playwright install chromium`); para validar el tema, **Python 3**.

Para validar el tema (en una copia de la rama `tema-horizon`):

```bash
python3 tienda/scripts/validar-ajustes-tema.py ruta/al/tema
```

## Licencias de las imágenes

- **Envases, logo y banners de marca:** ilustraciones originales generadas por los scripts.
- **Fotos de banco de imágenes:** licencias CC0, CC BY y CC BY-SA. Las CC BY **obligan a citar al
  autor**: el pie del tema muestra los créditos (lista en `tienda/imagenes/banco/CREDITOS.md`).
- **Tipografía Anton** del tema: SIL Open Font License.

## Cambio de mantenedor

Ver [`docs/TRANSFERENCIA.md`](docs/TRANSFERENCIA.md): transferir el repositorio, reconectar el tema
en Shopify con la nueva cuenta y salir del flujo.

---
*Vigor Sport Nutrition es una marca inventada para este proyecto.*
