# Vigor Sport Nutrition · tienda Shopify

Tienda online de suplementación deportiva (marca de ejemplo **Vigor Sport Nutrition**) hecha con
Shopify, sin apps: tema propio basado en Horizon + catálogo, imágenes y herramientas para
mantenerlo.

## Ramas

| Rama | Contenido | Uso |
|---|---|---|
| **`main`** (esta) | Catálogo en CSV, imágenes, scripts y guías | Se importa a mano en Shopify (*Productos → Importar*) |
| **`tema-horizon`** | El tema de la tienda (Horizon adaptado) | Conectada a Shopify: se sincroniza sola en los dos sentidos |

> Shopify exige que el tema esté en la raíz de la rama que se conecta, por eso el tema vive en su
> propia rama. Su README explica cómo conectarlo y qué se ha cambiado sobre Horizon.

## Qué hay en `main`

```
tienda/
├── GUIA-TIENDA.md                 ← guía paso a paso: montar, configurar y mantener la tienda
├── productos-vigor.csv            ← catálogo completo para importar (21 productos, 41 variantes)
├── productos-vigor-imagenes.csv   ← solo imágenes (cambiar fotos sin tocar precios ni stock)
├── catalogo.mjs                   ← fuente de datos del catálogo (de aquí salen CSV e imágenes)
├── generar-csv.mjs                ← genera los CSV (opciones: --solo, --sin-stock, --solo-imagenes…)
├── sincronizar-desde-shopify.mjs  ← lee una exportación de Shopify y hace un informe de cambios y errores
├── lib/                           ← código compartido (modelo de producto, CSV, repositorio, fotos)
├── herramientas/
│   └── validar-ajustes-tema.py    ← valida los ajustes del tema antes de subir cambios
└── imagenes/
    ├── productos-oscuro/          ← fotos de producto (envases) que enlaza el CSV
    ├── ambiente/                  ← segundas fotos de producto (banco de imágenes)
    ├── banco/                     ← fotos de banco de imágenes: originales, licencias y CRÉDITOS
    ├── recortes/                  ← aquí van las fotos reales de producto (ver su README)
    ├── marca/                     ← logo, favicon, imagen de Sobre nosotros y para redes
    ├── generar-imagenes.mjs       ← genera las fotos de producto (ilustración o foto real)
    └── procesar-fotos-banco.mjs   ← retoca las fotos de banco con el estilo de la marca
docs/
└── TRANSFERENCIA.md               ← cómo pasar el proyecto a otro mantenedor
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
| `npm run csv` | Regenera `productos-vigor.csv` y `productos-vigor-imagenes.csv` desde `catalogo.mjs` |
| `npm run imagenes` | Regenera las fotos de producto (usa las fotos reales de `recortes/` si existen) |
| `npm run fotos-banco` | Retoca las fotos de banco de imágenes y actualiza los créditos |
| `npm run sincronizar -- export.csv` | Lee una exportación de productos de Shopify: copia de seguridad + informe |
| `npm run comprobar` | Comprueba que los CSV están al día (lo mismo que hace GitHub en cada cambio) |

Requisitos: **Node.js 22+**; para imágenes, **ImageMagick** y el navegador de Playwright
(`npx playwright install chromium`); para validar el tema, **Python 3**.

Para validar el tema (en una copia de la rama `tema-horizon`):

```bash
python3 tienda/herramientas/validar-ajustes-tema.py ruta/al/tema
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
