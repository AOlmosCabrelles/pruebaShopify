# Tema Vigor Sport Nutrition (basado en Horizon)

Esta rama (`tema-horizon`) contiene el **tema de la tienda**: el tema gratuito **Horizon 4.5.0**
de Shopify ([código original](https://github.com/Shopify/horizon), ver `README-HORIZON.md` y
`LICENSE.md`) adaptado a una tienda de suplementación deportiva.

## Cómo conectarlo a tu tienda (una sola vez)

1. Admin de Shopify → **Tienda online → Temas**.
2. En *Biblioteca de temas*: **Añadir tema → Conectar desde GitHub**.
3. Inicia sesión con GitHub y autoriza a Shopify (elige el repositorio `pruebaShopify`).
4. Selecciona el repositorio **pruebaShopify** y la rama **`tema-horizon`** → **Conectar**.
5. El tema aparece en la biblioteca → **⋯ → Vista previa**. Cuando te guste: **Publicar**.

Desde ese momento **funciona en las dos direcciones**:
- Cada cambio que se sube a esta rama en GitHub aparece solo en el tema de la tienda.
- Cada cambio que haces en el editor de temas de Shopify se guarda como un commit en esta rama.

## Qué se ha cambiado respecto a Horizon

| Zona | Cambios |
|---|---|
| **Estilo global** (`config/settings_data.json`) | Paleta: fondo blanco, texto `#111111`, **acento naranja `#E4572E`** (botones), fondo suave `#F4F1EC`. Títulos en **Montserrat** en mayúsculas, texto en Inter de 16 px. Bordes redondeados y tarjetas que se elevan al pasar el ratón |
| **Barra de anuncios** (`sections/header-group.json`) | Tres mensajes rotativos: envío gratis desde 50 €, envíos el mismo día y pago seguro |
| **Inicio** (`templates/index.json`) | Banner principal *"Rinde más. Recupera mejor."* → categorías → *Los imprescindibles* → *¿Por qué Vigor?* → Proteínas → calculadora de proteína → *Hecho para quien entrena de verdad* → preguntas frecuentes → newsletter |
| **Ficha de producto** (`templates/product.json`) | Aviso de **pocas unidades** (por debajo de 10), desplegables de envío, devoluciones, pago y asesoramiento, **calculadora "¿Cuánto te dura este bote?"** (solo en Proteínas), *Combínalo con* y franja de beneficios |
| **Tabla nutricional** (`assets/vigor.css`) | Las tablas de la descripción se ven como una tabla nutricional |

### Imágenes de ejemplo incluidas en el tema
Son ilustraciones originales de la marca ficticia (sin derechos de terceros). Se usan solas
mientras no subas imágenes propias:

| Imagen | Dónde se ve |
|---|---|
| `assets/vigor-hero.jpg` | Banner principal de la página de inicio |
| `assets/vigor-cat-*.jpg` | Tarjetas de categorías (Proteínas, Rendimiento, Recuperación, Salud, Snacks) |
| `assets/vigor-nosotros.jpg` | Sección *Hecho para quien entrena de verdad* |
| `assets/vigor-logo.png` | Logo de la cabecera, si no has subido uno en *Configuración del tema → Logo* |
| `assets/vigor-favicon.png` | Icono de la pestaña del navegador, si no has subido uno |

Las fotos de los productos están en la rama `main` (`tienda/imagenes/productos/`) y se cargan
solas al importar `tienda/productos-vigor.csv`.

### Secciones nuevas
Todas se pueden añadir, mover y editar desde el editor de temas (**Añadir sección → Vigor · …**):

| Sección | Archivo |
|---|---|
| Vigor · Banner | `sections/vigor-hero.liquid` (banner principal con imagen de ejemplo) |
| Vigor · Imagen y texto | `sections/vigor-imagen-texto.liquid` |
| Vigor · Beneficios | `sections/vigor-beneficios.liquid` |
| Vigor · Categorías | `sections/vigor-categorias.liquid` |
| Vigor · Calculadora | `sections/vigor-calculadora.liquid` |
| Vigor · FAQ | `sections/vigor-faq.liquid` (incluye datos estructurados para Google) |
| Vigor · Newsletter | `sections/vigor-newsletter.liquid` |

Los estilos están en `assets/vigor.css` y se cargan desde `snippets/vigor-variables.liquid`
(una línea añadida en `layout/theme.liquid`).

## Qué tienes que hacer tú en la tienda

El tema usa contenido que vive en la tienda, no en el tema:

- **Productos:** importa `tienda/productos-vigor.csv` (rama `main`). La calculadora usa el
  **peso de la variante** (1 kg, 2 kg) para calcular cuántos días dura el envase.
- **Colecciones** con estos identificadores (*handles*): `proteinas`, `rendimiento`,
  `recuperacion`, `salud` y `snacks`. Shopify los crea solos si las colecciones se llaman
  *Proteínas*, *Rendimiento*... Si usas otros nombres, elígelas en la sección *Vigor · Categorías*.
- **Menú principal** (`main-menu`) y menú del pie, en *Tienda online → Menús*.
- **Imágenes:** no hace falta subir nada para empezar; el tema trae imágenes de ejemplo. Cuando tengas las tuyas, cámbialas desde el editor.

## Comprobado

`shopify theme check`: **0 errores** en los archivos añadidos o modificados. Los avisos que
quedan son del código original de Horizon.
