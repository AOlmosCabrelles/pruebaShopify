# Tema Vigor Sport Nutrition (basado en Horizon)

Esta rama (`tema-horizon`) contiene el **tema de la tienda**: el tema gratuito **Horizon 4.5.0**
de Shopify ([código original](https://github.com/Shopify/horizon), ver `README-HORIZON.md` y
`LICENSE.md`) adaptado a una tienda de suplementación deportiva.

> **Tipografía:** los títulos usan **Anton** (© The Anton Project Authors, licencia SIL Open Font
> License 1.1), incluida en `assets/vigor-anton.woff2`. Se aplica sustituyendo las variables de
> fuente de Horizon, así que la fuente que elijas en *Configuración del tema → Tipografía → Títulos*
> no tendrá efecto mientras exista `snippets/vigor-variables.liquid`.

## Cómo conectarlo a tu tienda (una sola vez)

1. Admin de Shopify → **Tienda online → Temas**.
2. En *Biblioteca de temas*: **Añadir tema → Conectar desde GitHub**.
3. Inicia sesión con GitHub **con la cuenta del propietario del repositorio** y autoriza a Shopify.
4. Selecciona el repositorio del proyecto y la rama **`tema-horizon`** → **Conectar**.

> La conexión queda ligada a la cuenta de GitHub que la autoriza. Si el repositorio cambia de
> propietario, hay que reconectar el tema con la cuenta nueva (ver `docs/TRANSFERENCIA.md` en la rama `main`).
5. El tema aparece en la biblioteca → **⋯ → Vista previa**. Cuando te guste: **Publicar**.

Desde ese momento **funciona en las dos direcciones**:
- Cada cambio que se sube a esta rama en GitHub aparece solo en el tema de la tienda.
- Cada cambio que haces en el editor de temas de Shopify se guarda como un commit en esta rama.

## Qué se ha cambiado respecto a Horizon

| Zona | Cambios |
|---|---|
| **Estilo global** (`config/settings_data.json`, `snippets/vigor-variables.liquid`) | **Estilo agresivo de suplementación**: modo oscuro (fondo `#0B0B0B`, tarjetas `#161616`), acento **rojo fuego `#FF3D00`**, títulos en **Anton** (condensada, mayúsculas), esquinas rectas, botones con esquina cortada y brillo, cortes en diagonal y texturas de rayas |
| **Barra de anuncios** (`sections/header-group.json`) | Barra rojo fuego con texto negro en mayúsculas y tres mensajes rotativos |
| **Cabecera** (`sections/header-group.json`) | Dos filas: arriba, logo, buscador, cuenta y carrito (contador naranja) en blanco; abajo, barra negra con el menú centrado en mayúsculas y desplegables con imágenes de colección. En móvil, barra negra deslizable con las categorías bajo la cabecera. Se oculta al bajar y reaparece al subir. Sin selector de país/idioma
| **Pie de página** (`sections/footer-group.json`) | Pie Vigor: franja naranja de beneficios, logo blanco, redes sociales, enlaces automáticos a las categorías, ayuda, contacto con suscripción, aviso legal de complementos, políticas y métodos de pago |
| **Inicio** (`templates/index.json`) | Banner → franja de beneficios → categorías → *¿Cuál es tu objetivo?* (guía por objetivo con productos recomendados) → *Los más vendidos* (4 productos) → *Tu día con Vigor* (cuándo tomar cada suplemento) → *Hecho para quien entrena de verdad* → calculadora de proteína → preguntas frecuentes (7) → newsletter |
| **Ficha de producto** (`templates/product.json`) | Aviso de **pocas unidades** (por debajo de 10), desplegables de envío, devoluciones, pago y asesoramiento, **calculadora "¿Cuánto te dura este bote?"** (solo en Proteínas), *Combínalo con* y franja de beneficios |
| **Páginas de colección** (`templates/collection.json`) | Cabecera visual por categoría: color propio, ilustración, ruta de navegación, contador de productos y accesos rápidos al resto de categorías. Debajo, franja de beneficios |
| **Carrito** (`snippets/cart-summary.liquid`, `snippets/vigor-envio-gratis.liquid`) | Barra de progreso \"Te faltan X € para el envío gratis\" en el carrito lateral y en la página del carrito. Importe en *Configuración del tema → Vigor · Tienda* |
| **Página de categorías** (`templates/list-collections.json`, ruta `/collections`) | Cabecera *Elige tu objetivo* y tarjetas grandes por categoría con su color, ilustración, número de productos, descripción y enlace; Proteínas destacada en doble alto; tarjeta *Todo el catálogo*; otras colecciones como botones. Debajo, *¿Por qué Vigor?* |
| **Tabla nutricional** (`assets/vigor.css`) | Las tablas de la descripción se ven como una tabla nutricional |

### Imágenes incluidas en el tema
Las fotos del banner, las categorías y *Hecho para quien entrena de verdad* son **fotos reales de
bancos de imágenes con licencia abierta** (CC0, CC BY y CC BY-SA, vía Openverse), recortadas y
retocadas con el estilo de la marca. Originales, licencias y créditos: rama `main`,
`tienda/imagenes/banco/` (`CREDITOS.md`).

> ⚠️ Las licencias CC BY obligan a **citar al autor**. El pie muestra un desplegable
> *Créditos de imágenes* con la lista completa (`snippets/vigor-creditos-imagenes.liquid`), sin
> necesidad de crear ninguna página. Si además creas la página `creditos-de-imagenes`, se enlaza.

| Imagen | Dónde se ve |
|---|---|
| `assets/vigor-hero.jpg` | Banner principal (peso muerto) |
| `assets/vigor-cat-*.jpg` | Tarjetas de categorías y página `/collections` |
| `assets/vigor-cabecera-*.jpg` | Fondo a todo lo ancho de la cabecera de cada colección (recortes horizontales) |
| `assets/vigor-nosotros.jpg` | Sección *Hecho para quien entrena de verdad* (gimnasio clásico) |
| `assets/vigor-logo.png`, `vigor-logo-blanco.png`, `vigor-favicon.png` | Logo y favicon de ejemplo (si no subes los tuyos) |

Cualquiera se sustituye desde el editor de temas eligiendo otra imagen en la sección.
Las fotos de producto (envases y fotos de ambiente) están en la rama `main` y se cargan con el CSV.

### Secciones nuevas
Todas se pueden añadir, mover y editar desde el editor de temas (**Añadir sección → Vigor · …**):

| Sección | Archivo |
|---|---|
| Vigor · Banner | `sections/vigor-hero.liquid` (banner principal con corte diagonal y 2ª línea del título en color) |
| Vigor · Cinta | `sections/vigor-cinta.liquid` (cinta de frases en movimiento, inclinada) |
| Vigor · Imagen y texto | `sections/vigor-imagen-texto.liquid` |
| Vigor · Cabecera | `sections/vigor-cabecera-coleccion.liquid` (cabecera de las páginas de colección) |
| Vigor · Todas categorías | `sections/vigor-lista-colecciones.liquid` (página `/collections`) |
| Vigor · Pie de página | `sections/vigor-footer.liquid` |
| Vigor · Objetivos | `sections/vigor-objetivos.liquid` |
| Vigor · Cuestionario | `sections/vigor-cuestionario.liquid` ("Encuentra tu suplemento": 3 preguntas → 3 productos con botón de añadir al carrito) |
| Vigor · Tu día | `sections/vigor-rutina.liquid` |
| Vigor · Beneficios | `sections/vigor-beneficios.liquid` |
| Vigor · Categorías | `sections/vigor-categorias.liquid` |
| Vigor · Calculadora | `sections/vigor-calculadora.liquid` |
| Vigor · FAQ | `sections/vigor-faq.liquid` (incluye datos estructurados para Google) |
| Vigor · Newsletter | `sections/vigor-newsletter.liquid` |

Los estilos están en `assets/vigor.css` y se cargan desde `snippets/vigor-variables.liquid`.

### Archivos originales de Horizon modificados
Casi todo lo propio está en archivos `vigor-*`. Estos son los únicos archivos de Horizon tocados
(revisarlos al actualizar Horizon a una versión nueva):

| Archivo | Cambio |
|---|---|
| `layout/theme.liquid` | Carga `vigor-variables` y favicon de ejemplo |
| `blocks/_header-logo.liquid` | Logo de ejemplo si no se ha subido uno |
| `snippets/cart-summary.liquid` | Una línea: barra de envío gratis |
| `config/settings_schema.json` | Grupo nuevo *Vigor · Tienda* (envío gratis) |
| `config/settings_data.json`, `templates/*.json`, `sections/*-group.json` | Ajustes y secciones de la tienda |

## Qué tienes que hacer tú en la tienda

El tema usa contenido que vive en la tienda, no en el tema:

- **Productos:** importa `tienda/productos-vigor.csv` (rama `main`). La calculadora usa el
  **peso de la variante** (1 kg, 2 kg) para calcular cuántos días dura el envase.
- **Colecciones** con estos identificadores (*handles*): `proteinas`, `rendimiento`,
  `recuperacion`, `salud`, `snacks` y `accesorios`. Shopify los crea solos si las colecciones se llaman
  *Proteínas*, *Rendimiento*, *Accesorios*... Si usas otros nombres, elígelas en la sección *Vigor · Categorías*.
- **Menú principal** (`main-menu`) y menú del pie, en *Tienda online → Menús*.
- **Imágenes:** no hace falta subir nada para empezar; el tema trae imágenes de ejemplo. Cuando tengas las tuyas, cámbialas desde el editor.

## Comprobado

`shopify theme check`: **0 errores** en los archivos añadidos o modificados. Los avisos que
quedan son del código original de Horizon.
