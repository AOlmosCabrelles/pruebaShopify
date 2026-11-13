# Fotos reales de producto

> 🧪 **Ahora mismo hay dos fotos de EJEMPLO** (no son fotos reales, las creó Claude para probar):
> - `whey-protein-isolate-chocolate-2kg.jpg`: "foto" sobre fondo blanco, para probar el quitado de fondo automático.
> - `creatina-monohidrato.png`: recorte transparente, aplicado a todas las variantes de la creatina.
>
> Para verlas en la tienda: importa `tienda/csv/ejemplo-fotos-reales.csv` con *Sobrescribir*.
> Para quitarlas: borra esos dos archivos, regenera imágenes y CSV, y reimporta el CSV de imágenes
> (o vuelve a importar `tienda/csv/ejemplo-fotos-reales.csv` generado de nuevo).

Deja aquí las fotos reales. Al ejecutar el generador, cada producto que tenga foto la usa
**sobre el mismo fondo de estudio oscuro** que las ilustraciones (halo del color del sabor,
reflejo rojo y sombra). Los productos sin foto siguen con su ilustración.

## Cómo nombrar los archivos

| Archivo | Se usa en |
|---|---|
| `whey-protein-isolate-chocolate-2kg.png` | Solo esa variante (identificador + valores de la variante) |
| `creatina-monohidrato.png` | Todas las variantes del producto |

- El **identificador** es el *handle* del producto: lo ves al final de su URL en la tienda
  (`/products/whey-protein-isolate`).
- Los **valores** de la variante van en minúsculas, sin tildes y con guiones, y los tamaños
  juntos: `chocolate-2kg`, `frutos-rojos`, `90-capsulas`.
- Para saber el nombre exacto de cada variante, mira la columna *Image Src* del CSV
  `tienda/csv/productos-vigor.csv`: es el mismo nombre (sin `.jpg`).

## Formatos

| Formato | Qué hace el script |
|---|---|
| **PNG con fondo transparente** (recomendado) | Lo usa tal cual (solo quita el margen vacío) |
| **JPG o WEBP sobre fondo blanco o liso** | **Quita el fondo automáticamente.** Funciona bien con fondos limpios y uniformes; si queda algún borde raro, recorta la foto con una herramienta de quitar fondos y guárdala en PNG |

Consejos: envase de frente y centrado, buena luz, sin reflejos fuertes, al menos 1500 px de alto.

## Después de añadir fotos

```bash
node tienda/scripts/generar-imagenes.mjs tienda/imagenes
```
```bash
node tienda/scripts/generar-csv.mjs
```
```bash
node tienda/scripts/generar-csv.mjs --solo-imagenes --salida tienda/csv/productos-vigor-imagenes.csv
```

Haz commit y push (las fotos tienen que estar en GitHub para que Shopify pueda descargarlas)
e importa `tienda/csv/productos-vigor-imagenes.csv` con *Sobrescribir*.

Las fotos reales se guardan con el sufijo `-foto` (p. ej. `whey-protein-isolate-chocolate-2kg-foto.jpg`).
Así su dirección es distinta de la ilustración y Shopify la descarga como imagen nueva.

> Asegúrate de tener **derecho a usar** cada foto (propia o con permiso del fabricante) y de
> que la etiqueta que se ve en la foto **coincide** con la ficha del producto.
