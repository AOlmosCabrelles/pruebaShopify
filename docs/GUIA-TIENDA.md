# Montar la tienda online de Vigor Sport Nutrition (sin programar)

Guía para crear la **web de venta de suplementos** solo con el panel de Shopify:
crear la tienda, elegir el tema, cargar el catálogo y el inventario de ejemplo y dejarla
lista para vender. **No hace falta ninguna app ni escribir código.**

Archivos de la carpeta `tienda/` que usa esta guía:
| Archivo | Para qué |
|---|---|
| `csv/productos-vigor.csv` | Catálogo de ejemplo: **21 productos, 41 variantes**, con precios, stock, SKU, peso, información nutricional, imágenes y SEO |
| `csv/productos-vigor-imagenes.csv` | CSV que **solo cambia las fotos** de los productos (no toca precios, textos ni stock) |
| `csv/inventario-vigor.csv` | CSV de **inventario** con el stock de ejemplo (*Productos → Inventario → Importar*) |
| `catalogo.mjs` | Los datos del catálogo. Si cambias algo aquí, regenera los CSV con `npm run csv` |
| `imagenes/productos-oscuro/` | 41 fotos de producto con fondo oscuro, una por variante (ya enlazadas en el CSV) |
| `imagenes/banco/` | Fotos reales de banco de imágenes (originales, licencias y **créditos**) usadas en el tema y como foto de ambiente |
| `imagenes/ambiente/` | Segundas fotos de producto (ambiente), ya enlazadas en el CSV |
| `imagenes/recortes/` | Aquí van las **fotos reales** de producto; el generador las pone sobre el fondo de estudio oscuro (instrucciones en su README) |
| `imagenes/marca/` | Logo (oscuro y blanco), favicon, imagen de *Sobre nosotros* e imagen para redes sociales |
| `scripts/generar-imagenes.mjs` | Script que genera todas las imágenes (por si quieres cambiar colores o textos) |
| `scripts/generar-csv.mjs` | Genera CSV de importación: el catálogo completo, solo algunos productos o sin stock |
| `scripts/sincronizar-desde-shopify.mjs` | Lee una exportación de Shopify, guarda una copia y genera un informe de cambios y errores |
| `sincronizacion/` | Lo crea el script anterior: copias de las exportaciones, `catalogo-shopify.json` e `INFORME.md` |

---|---|
| `productos-vigor.csv` | Catálogo de ejemplo: **21 productos, 41 variantes**, con precios, stock, SKU, peso, información nutricional, imágenes y SEO |
| `catalogo.mjs` | Los datos del catálogo. Si cambias algo aquí, regenera el CSV con `node tienda/scripts/generar-csv.mjs` |
| `GUIA-TIENDA.md` | Esta guía, con los textos listos para copiar y pegar |
| `imagenes/productos-oscuro/` | 41 fotos de producto con fondo oscuro, una por variante (ya enlazadas en el CSV) |
| `productos-vigor-imagenes.csv` | CSV que **solo cambia las fotos** de los productos (no toca precios, textos ni stock) |
| `inventario-vigor.csv` | CSV de **inventario** con el stock de ejemplo (*Productos → Inventario → Importar*) |
| `imagenes/banco/` | Fotos reales de banco de imágenes (originales, licencias y **créditos**) usadas en el tema y como foto de ambiente |
| `imagenes/ambiente/` | Segundas fotos de producto (ambiente), ya enlazadas en el CSV |
| `imagenes/recortes/` | Aquí van las **fotos reales** de producto; el generador las pone sobre el fondo de estudio oscuro (instrucciones en su README) |
| `imagenes/marca/` | Logo (oscuro y blanco), favicon, imagen de *Sobre nosotros* e imagen para redes sociales |
| `imagenes/generar-imagenes.mjs` | Script que genera todas las imágenes (por si quieres cambiar colores o textos) |
| `generar-csv.mjs` | Genera CSV de importación: el catálogo completo, solo algunos productos o sin stock |
| `sincronizar-desde-shopify.mjs` | Lee una exportación de Shopify, guarda una copia y genera un informe de cambios y errores |
| `sincronizacion/` | Lo crea el script anterior: copias de las exportaciones, `catalogo-shopify.json` e `INFORME.md` |

---

## Paso 1 · Crear la tienda

Tienes dos opciones:

| Opción | Cuándo | Cómo |
|---|---|---|
| **Tienda de desarrollo** (recomendada para el simulacro) | Para practicar. Es gratis y no caduca, pero no puede vender de verdad | https://shopify.dev → *Dev Dashboard* → **Dev stores → Create store** |
| **Tienda normal con prueba gratuita** | Si quieres que acabe siendo tu tienda real | https://www.shopify.com/es → **Empieza tu prueba gratuita** |

Nombre de la tienda: `Vigor Sport Nutrition` (o el tuyo).

## Paso 2 · Configuración básica

Todo esto está en **Configuración** (abajo a la izquierda del admin):

| Sección | Qué poner |
|---|---|
| **General** | Nombre, email de contacto, dirección. Moneda: **Euro (EUR)**. Zona horaria: **Madrid** |
| **Idiomas** | Idioma principal: **Español** |
| **Impuestos y aranceles** | España con **IVA incluido en los precios** (activa *"Incluir impuestos en los precios"*). Los suplementos suelen llevar el 10 % de IVA, pero confírmalo con tu gestor |
| **Envío y entrega** | Zona *España*: tarifa **Estándar 4,95 €** (48-72 h) y tarifa **Gratis** para pedidos **de más de 50 €**. Si cambias el importe, cámbialo también en *Personalizar → Configuración del tema → Vigor · Tienda* (barra de envío gratis del carrito) |
| **Pagos** | En la tienda de desarrollo: activa el *proveedor de prueba* (Bogus Gateway). En una tienda real: **Shopify Payments** en modo prueba |
| **Pantalla de pago (checkout)** | Pide nombre y apellidos, y activa la casilla de suscripción a novedades |

## Paso 3 · Importar el catálogo y el inventario

### 3.1 Descargar el CSV
1. Abre en GitHub el archivo [`tienda/csv/productos-vigor.csv`](../tienda/csv/productos-vigor.csv) de este repositorio
2. Arriba a la derecha del archivo, pulsa el botón de descarga (**Download raw file**, icono ⬇).
3. Se guarda `productos-vigor.csv` en tu carpeta de Descargas. **No lo abras ni lo guardes con
   Excel**, porque puede estropear los acentos y las comas.

### 3.2 Importarlo en Shopify
1. En el admin, ve a **Productos** (menú de la izquierda).
2. Arriba a la derecha, pulsa **Importar**.
3. **Añadir archivo** → elige `productos-vigor.csv`.
4. Marca **"Sobrescribir los productos que tengan el mismo identificador"**. Así, si lo importas
   dos veces, actualiza los productos en lugar de duplicarlos.
5. Pulsa **Cargar y obtener vista previa**. Verás el primer producto (Whey Protein Isolate) con su
   descripción y su imagen. Si la vista previa muestra un error, copia el mensaje y pásamelo.
6. Pulsa **Importar productos**.
7. Espera 2 o 3 minutos. Shopify descarga las 41 imágenes y te envía un email cuando termina.
   Recarga **Productos**: deberían aparecer **21 productos**.

### 3.3 Qué se importa

| Tipo | Productos | Variantes |
|---|---|---|
| **Proteínas** | Whey Protein Isolate · Whey Protein Concentrada · Proteína Vegana · Caseína Micelar | sabores × 1 kg / 2 kg |
| **Rendimiento** | Creatina Monohidrato · Pre-Entreno Explosive · Beta-Alanina · Citrulina Malato · Cafeína 200 mg · Bebida Isotónica | tamaños y sabores |
| **Recuperación** | BCAA 2:1:1 · L-Glutamina · Colágeno + Magnesio | sabores |
| **Salud** | Multivitamínico Sport · Omega-3 · Vitamina D3 + K2 · Magnesio Bisglicinato | cápsulas y perlas |
| **Snacks** | Barritas proteicas · Galletas proteicas · Crema de cacahuete | sabores y texturas |
| **Accesorios** | Shaker Vigor 700 ml | Negro / Naranja |

Precios de 7,90 € a 59,90 €. Cada producto incluye en la descripción la **tabla nutricional**,
los **alérgenos en negrita**, el **modo de empleo**, las advertencias obligatorias (cafeína,
complementos alimenticios) y una imagen por variante.

### 3.4 Comprobar el inventario
Ve a **Productos → Inventario**. Algunas variantes tienen muy poco stock a propósito, para que
practiques reponer: Whey Isolate Vainilla 2 kg (3 uds), Pre-Entreno Frutos rojos (2 uds),
Whey Concentrada Cookies 2 kg (4 uds) y Magnesio (5 uds).
La política es *"no vender sin stock"*, así que cuando una variante llega a 0 aparece como **Agotado**.
Para reponer, haz clic en la cantidad de la columna **Disponible**, escribe la nueva y pulsa **Guardar**.

**Si todo sale con 0 en existencias** (el CSV de productos no cambia el stock de productos que ya
existen), usa `inventario-vigor.csv`:
1. Comprueba el nombre de tu ubicación en **Configuración → Ubicaciones**. El CSV usa `Shop location`;
   si la tuya se llama distinto, genera otro con `node tienda/scripts/generar-inventario.mjs --ubicacion "Tu nombre"`.
2. **Productos → Inventario → Importar** → elige `inventario-vigor.csv` → importa.
3. Pone el stock de ejemplo en las 41 variantes (1086 unidades). ⚠️ En una tienda con ventas reales
   borraría las cantidades de verdad.

**Cambiar las fotos de productos ya importados** (por ejemplo, a la versión de fondo oscuro):
importa `productos-vigor-imagenes.csv` con *Sobrescribir los productos que tengan el mismo
identificador*. Prueba primero con un solo producto y comprueba que la foto nueva **sustituye**
a la anterior; si en tu versión de Shopify se **añade** a las existentes, borra las antiguas desde
*Medios* (selecciona varias a la vez → Eliminar).

**Fotos de ambiente:** 15 productos llevan una **segunda foto real** de banco de imágenes
(batido, cápsulas, perlas de omega-3, crema de cacahuete, galletas…), retocada con el estilo
de la marca. Se importan con el CSV de imágenes.

**Créditos de imágenes (obligatorio):** varias fotos tienen licencia CC BY, que exige citar al autor.
El pie del tema Vigor ya muestra un desplegable **"Créditos de imágenes"** con la lista completa;
no hace falta hacer nada. Si además quieres una página propia, crea en *Páginas* una llamada
`Créditos de imágenes` con el HTML de `tienda/imagenes/banco/creditos.html` (botón **</>**) y el pie
la enlazará. Las páginas están en `https://admin.shopify.com/store/<identificador-de-la-tienda>/pages`

**Fotos reales:** deja las fotos en `tienda/imagenes/recortes/` (PNG transparente, o JPG sobre
fondo blanco y el script quita el fondo), regenera imágenes y CSV, y reimporta el CSV de imágenes.
Los productos sin foto real siguen con su ilustración, así que puedes cambiarlas poco a poco.
Detalles en `tienda/imagenes/recortes/README.md`.

**Imágenes:** son **ilustraciones de ejemplo** creadas para este simulacro. Cuando tengas fotos
reales, cámbialas en cada producto (**Medios**). Formato cuadrado, 2048 × 2048 px.

## Paso 4 · Colecciones (las categorías de la web)

Una colección es una categoría de la tienda. Vamos a crear colecciones **automatizadas**, que
se rellenan solas según el **tipo de producto** que trae el CSV.

**Haz el paso 3 antes que este**, así verás cómo se llenan.

### 4.1 Crear la primera colección (Proteínas)
1. En el admin, ve a **Productos → Colecciones**.
2. Pulsa **Crear colección**.
3. **Título:** `Proteínas`.
4. **Descripción** (opcional): `Proteína de suero, vegana y caseína para ganar músculo y recuperarte mejor.`
5. En el panel de la derecha (**Productos**) pulsa **+ Agregar condición**. Al añadir una
   condición, la colección pasa a ser automática. (En versiones anteriores del admin, primero
   había que elegir *Tipo de colección → Automatizada*.)
   - Campo: **Etiqueta del producto** (no "Categoría del producto")
   - Operador: **es igual a**
   - Valor: `cat-proteinas`
   - **No** uses *Agregar productos*: eso crea una colección manual que no se rellena sola.
6. Pulsa **Guardar** (barra superior). Abajo aparecerán los 4 productos de proteína (puede tardar unos segundos).
7. **Comprueba el identificador:** al final de la página, en *Vista previa del listado del motor de
   búsqueda* → **Editar**, la URL debe terminar en `/collections/proteinas`. El tema usa ese
   identificador para la tarjeta de categoría y la cabecera de color.

> **¿Por qué la etiqueta y no el tipo de producto?** Cada producto del CSV lleva una etiqueta de
> categoría sin tildes ni mayúsculas (`cat-proteinas`, `cat-rendimiento`...), así no hay errores
> al escribir la condición. La condición *Tipo de producto es igual a* `Proteínas` también
> funciona, pero hay que escribir el tipo exactamente igual, con tilde.

### 4.2 Repetir con el resto
| Título | Condición: Etiqueta del producto es igual a | Identificador (URL) | Productos |
|---|---|---|---|
| Proteínas | `cat-proteinas` | `proteinas` | 4 |
| Rendimiento | `cat-rendimiento` | `rendimiento` | 6 |
| Recuperación | `cat-recuperacion` | `recuperacion` | 3 |
| Salud | `cat-salud` | `salud` | 4 |
| Snacks | `cat-snacks` | `snacks` | 3 |
| Accesorios | `cat-accesorios` | `accesorios` | 1 |

### Si una colección sale vacía
| Comprueba | Cómo |
|---|---|
| ¿Se importaron los productos? | **Productos** debe mostrar 21. Si hay menos, revisa el email de Shopify sobre la importación |
| ¿Tiene una **condición**? | En el panel derecho *Productos* debe verse una condición (p. ej. *Etiqueta del producto es igual a cat-proteinas*). Si solo añadiste productos a mano con *Agregar productos*, no se rellena sola |
| ¿El primer desplegable es el correcto? | Debe ser **Etiqueta del producto** (o **Tipo de producto**). *Categoría del producto* es otra cosa (la clasificación estándar de Shopify) y el CSV no la rellena |
| ¿El producto tiene la etiqueta? | Abre un producto → panel derecho **Organización del producto → Etiquetas**: debe aparecer `cat-proteinas`. Si no está, vuelve a importar el CSV actualizado marcando *Sobrescribir* |
| ¿El texto tiene acentos raros? (`ProteÃ­nas`) | El CSV se abrió y guardó con Excel. Descárgalo de nuevo de GitHub e impórtalo sin abrirlo |
| ¿Sobra un espacio en la condición? | Borra el texto de la condición y escríbelo de nuevo |

No hace falta crear "Todos los productos": Shopify ya la tiene en `/collections/all`.

### 4.3 Extras opcionales
- **Imagen de la colección:** en cada colección, en el apartado *Imagen de colección*, puedes
  subir la ilustración de su categoría. Están en la rama del tema, en
  `assets/` de la rama `tema-horizon`
  (`vigor-cat-proteinas.jpg`, etc.). Si usas el tema Vigor no hace falta: ya las muestra solo.
- **Colección "Más vendidos":** Automatizada con la condición *Precio del producto es mayor que 0*
  y ordenada por **Más vendidos**.
- **Colección "Veganos":** Automatizada con la condición *Etiqueta del producto es igual a* `vegana`.

### 4.4 Añadirlas al menú
**Contenido → Menús → Menú principal** → **Añadir elemento de menú** → escribe el nombre y,
en *Enlace*, elige **Colecciones →** la colección correspondiente. Arrástralas para ordenarlas.

## Paso 5 · Elegir el tema (el diseño)

> ✨ **Atajo:** en la rama `tema-horizon` de este repositorio
> está Horizon ya adaptado a suplementos (colores, inicio, ficha de producto, calculadora, FAQ...).
> Para usarlo: **Tienda online → Temas → Añadir tema → Conectar desde GitHub** → repositorio
> del proyecto, rama `tema-horizon`. Los detalles están en el README de esa rama. Si lo usas,
> puedes saltarte casi todo el paso 6.

**Tienda online → Temas.** Ya tienes instalado el tema gratuito por defecto (Horizon).

### Qué necesita una tienda de suplementos
| Necesidad | Por qué |
|---|---|
| **Filtros** en las colecciones (sabor, tamaño, precio) | El cliente busca "proteína de chocolate de 2 kg" |
| **Selector de variantes claro** (botones, no desplegables) | Sabor y tamaño, en un clic |
| **Botón de compra rápida** en los listados | Recompras rápidas, como volver a pedir la proteína |
| **Menú grande** (mega menú) | Muchas categorías |
| **Pestañas o desplegables** en la ficha de producto | Para la tabla nutricional, el modo de empleo y los alérgenos |
| **Diseño excelente en móvil** | Más del 70 % de las visitas llegan desde el móvil |

### Cómo elegir
1. Empieza con el **tema gratuito por defecto**. Ya cumple casi todo lo anterior y es muy rápido.
2. Si quieres comparar: **Tienda online → Temas → Tienda de temas (Theme Store)** → filtra por
   **Gratis** y por el sector *Salud y belleza* o *Alimentación*.
3. En cada tema que te guste, pulsa **Probar tema**. Se añade a tu biblioteca sin publicarse y lo
   ves con **tus** productos.
4. Prueba 2 o 3 y publica el que más te convenza: **⋯ → Publicar**.
5. Los temas de pago (pago único) solo merecen la pena si necesitas algo concreto que los gratuitos no tengan.

## Paso 6 · Personalizar la web

**Tienda online → Temas → Personalizar.** Arriba eliges qué página editar: Inicio, Producto, Colección...

### Imágenes de marca (carpeta `imagenes/marca/`)
| Archivo | Dónde se sube |
|---|---|
| `logo-vigor.png` | Personalizar → Configuración del tema → **Logo** (el tema Vigor ya lo muestra aunque no lo subas) |
| `favicon-vigor.png` | Configuración del tema → Logo → **Favicon** |
| `sobre-nosotros.jpg` | Página *Sobre nosotros* → botón de insertar imagen |
| `compartir-redes.jpg` | Configuración del tema → Redes sociales → **Imagen para compartir** |

### Estilo de marca (Configuración del tema)
- **Colores:** fondo blanco, texto casi negro `#111111`, color de acento enérgico `#E4572E` (naranja) para botones y ofertas.
- **Tipografía:** títulos en una fuente gruesa (p. ej. *Montserrat* o *Archivo*), texto en *Inter*.
- **Logo:** sube el tuyo (PNG con fondo transparente).

### Página de inicio: secciones y textos para copiar

| # | Sección | Contenido |
|---|---|---|
| 1 | **Barra de anuncios** | `🚚 Envío GRATIS en pedidos de más de 50 €` |
| 2 | **Banner principal** (imagen grande) | Título: `Rinde más. Recupera mejor.`  Subtítulo: `Suplementación deportiva de calidad, con fórmulas claras y sin rellenos.`  Botón: `Ver productos` → colección *Todos los productos* |
| 3 | **Lista de colecciones** | Proteínas, Rendimiento, Recuperación, Salud, Snacks |
| 4 | **Colección destacada** | Título: `Los imprescindibles`. Colección: *Todos los productos*. 4 productos |
| 5 | **Texto con iconos** (3 columnas) | `Fórmulas transparentes` – *Sabes exactamente lo que tomas.* · `Envío en 48-72 h` – *Gratis desde 50 €.* · `Pago seguro` – *Tarjeta, Bizum y más.* |
| 6 | **Imagen con texto** | Título: `¿Cuánta proteína necesitas?`  Texto: `Como orientación general, entre 1,6 y 2 g por kg de peso al día si entrenas fuerza. Consulta siempre con un profesional.`  Botón: `Ver proteínas` |
| 7 | **Preguntas frecuentes** (desplegable) | Las de la página FAQ (paso 7) |
| 8 | **Suscripción por email** | `Únete y llévate un 10 % en tu primer pedido` |

> No añadas opiniones o valoraciones inventadas. Cuando tengas clientes reales, puedes
> añadir reseñas reales (por ejemplo, con la app gratuita de reseñas de Shopify).

### Página de producto
- Activa las **pestañas o desplegables** del tema y crea uno llamado `Envíos y devoluciones` con el texto de tu política de envío.
- Muestra los **botones de variante** (sabor y tamaño) en lugar de desplegables.
- Activa **"Productos relacionados"** al final.

## Paso 7 · Páginas y menús

### Páginas (**Contenido → Páginas → Añadir página**)

**Sobre nosotros**
```
En Vigor Sport Nutrition creemos que la suplementación debe ser sencilla y honesta.
Seleccionamos fórmulas con ingredientes claros, dosis útiles y sin rellenos, para que
te centres en lo importante: entrenar y recuperarte.
```

**Preguntas frecuentes**
```
¿Cuánto tarda el envío?
Entre 48 y 72 horas laborables en España peninsular. Gratis a partir de 50 €.

¿Puedo devolver un producto?
Sí, en un plazo de 14 días si el envase está cerrado y precintado.

¿Cuál es la diferencia entre whey concentrada e isolate?
La isolate tiene más proteína por dosis y menos lactosa, grasa e hidratos.

¿Cuándo tomo la creatina?
A cualquier hora del día; lo importante es tomar 3 g todos los días.

¿Los productos tienen alérgenos?
Cada ficha indica los alérgenos en negrita. Si tienes alguna alergia, revísala antes de comprar.
```

**Contacto:** al crear la página, elige la plantilla **page.contact** para que muestre un formulario.

### Políticas legales
**Configuración → Políticas**: genera desde plantilla las de **Reembolso**, **Privacidad**,
**Términos del servicio** y **Envío**, y revísalas. Crea también una página **Aviso legal**
con tus datos fiscales (obligatoria en España). En **Configuración → Privacidad de los clientes**,
activa el **banner de cookies**.

### Menús (**Contenido → Menús**)

> En el admin actual de Shopify, los menús y las páginas están en **Contenido** (menú de la izquierda), no en *Tienda online*. También puedes escribir "Menús" en el buscador de arriba del admin, o abrirlos desde el editor de temas: cabecera → bloque *Menú* → **Editar menú**.

**Menú principal** (`main-menu`): la cabecera del tema Vigor muestra un panel con imágenes en los
elementos que tienen subelementos.

```
Tienda                → Colecciones › Todos los productos
  ├─ Proteínas        → Colecciones › Proteínas
  ├─ Rendimiento      → Colecciones › Rendimiento
  ├─ Recuperación     → Colecciones › Recuperación
  ├─ Salud            → Colecciones › Salud
  ├─ Snacks           → Colecciones › Snacks
  └─ Accesorios       → Colecciones › Accesorios
Proteínas             → Colecciones › Proteínas
Rendimiento           → Colecciones › Rendimiento
Salud                 → Colecciones › Salud
Contacto              → Páginas › Contacto
```

Pasos:
1. **Contenido → Menús → Menú principal**. Borra *Catálogo* (icono de papelera). Si dejas
   *Inicio*, no pasa nada, aunque el logo ya lleva al inicio.
2. **Agregar elemento de menú** → *Etiqueta* `Tienda` → *Enlace*: **Colecciones → Todos los productos** → **Agregar**.
3. Repite para cada categoría (`Proteínas`, `Rendimiento`...) con su colección.
4. **Anidar:** arrastra cada categoría desde el icono ⋮⋮ y suéltala **un poco a la derecha y debajo
   de "Tienda"**. Queda sangrada, lo que significa que es un subelemento.
5. Añade de nuevo `Proteínas`, `Rendimiento` y `Salud` sin anidar, como accesos directos, y `Contacto`
   (**Páginas → Contacto**).
6. **Guardar menú**.

**Menú del pie** (`footer`, se muestra en la columna *Ayuda* del pie Vigor):

| Etiqueta | Enlace |
|---|---|
| Sobre nosotros | Páginas › Sobre nosotros |
| Preguntas frecuentes | Páginas › Preguntas frecuentes |
| Envíos | Políticas › Política de envío |
| Devoluciones | Políticas › Política de reembolso |
| Contacto | Páginas › Contacto |
| Aviso legal | Páginas › Aviso legal |

Las políticas legales ya aparecen solas en la franja inferior del pie, así que no hace falta
repetirlas todas aquí.

## Paso 8 · Probar como si fueras un cliente

1. Abre la tienda (icono del ojo junto a *Tienda online*). La contraseña está en **Tienda online → Preferencias**.
2. Navega desde el **móvil**: inicio → colección → ficha → elegir sabor y tamaño → carrito.
3. Comprueba que el pedido de 59,90 € tiene **envío gratis** y que uno de 19,90 € paga 4,95 €.
4. Haz un **pedido de prueba**. Con Bogus Gateway, usa como número de tarjeta `1` (aprobado) o `2` (rechazado).
5. En el admin, ve a **Pedidos**: el pedido aparece ahí y el **stock de la variante baja** solo.
6. Compra las últimas unidades de *Pre-Entreno Frutos rojos* y comprueba que pasa a **Agotado**.

## Paso 9 · Antes de abrir al público (solo para la tienda real)

- [ ] Elegir un **plan** de Shopify
- [ ] Comprar o conectar un **dominio** (Configuración → Dominios)
- [ ] Activar **Shopify Payments** de verdad (con tus datos bancarios)
- [ ] Quitar la **contraseña** de la tienda (Tienda online → Preferencias)
- [ ] Fotos reales en todos los productos
- [ ] Revisar las políticas legales y el aviso legal
- [ ] **Normativa de suplementos:** usar solo declaraciones de salud autorizadas (Reglamento UE 1924/2006), mostrar la información nutricional y los alérgenos (Reglamento 1169/2011), y, si eres tú quien pone el producto en el mercado con tu marca, notificarlo a la **AESAN**. Si revendes marcas de terceros, pídeles su documentación

---

## Paso 10 · Mantenimiento del catálogo (cuando la tienda ya esté en marcha)

### Cómo funciona cada sincronización

| Qué | Cómo se sincroniza | ¿Puedo cambiarlo a mano? |
|---|---|---|
| **Tema** (diseño, textos, secciones) | **Automática y en los dos sentidos** con la rama `tema-horizon` de GitHub. Lo que cambias en el editor de temas se guarda en GitHub; lo que cambia en GitHub aparece en la tienda | Sí, con total libertad. Si vas a hacer cambios grandes, avisa para no editar lo mismo a la vez |
| **Productos** | **No hay sincronización automática.** El CSV es una carga puntual: solo afecta a la tienda cuando lo importas | Sí, pero lee lo que sigue |
| **Menús, páginas, colecciones** | Viven solo en Shopify | Sí, siempre desde el admin |

### La regla de oro: Shopify manda
Desde que la tienda está en marcha, **los productos se gestionan en el admin de Shopify**. El
catálogo del repositorio (`catalogo.mjs` y `productos-vigor.csv`) es el **catálogo inicial**.

> ⚠️ **No vuelvas a importar `productos-vigor.csv` completo con "Sobrescribir".** Haría esto:
> - Volvería a poner los **precios, títulos y descripciones** de ejemplo, y perderías tus cambios.
> - **Restablecería el stock** a las cantidades de ejemplo, y se perderían las ventas descontadas.
> - Podría duplicar o mezclar imágenes.
>
> Los productos creados a mano que no estén en el CSV no se tocan.

### Añadir un producto a mano (checklist)
Lo más rápido: abre un producto parecido → **⋯ → Duplicar** y cambia lo necesario. Hereda el
tipo, las etiquetas, el formato de la descripción y el inventario.

| Campo | Qué poner | Si no lo pones… |
|---|---|---|
| **Tipo** | Exactamente: `Proteínas`, `Rendimiento`, `Recuperación`, `Salud`, `Snacks` o `Accesorios` | No funcionan los filtros ni la calculadora de proteína |
| **Etiquetas** | `cat-proteinas` (o la de su categoría) y otras que quieras | **No entra en su colección** |
| **Descripción** | La de un producto parecido, cambiando los datos: tabla *Información nutricional*, *Alérgenos*, *Modo de empleo* y avisos | Incumples el etiquetado obligatorio y la tabla no sale con estilo |
| **Peso por variante** | En gramos (1 kg = 1000) | La calculadora no dice cuántos días dura el envase |
| **Imágenes** | Cuadradas, una por variante | Al cambiar de sabor no cambia la foto |
| **Inventario** | *Hacer seguimiento* activado, *vender sin stock* desactivado | No aparece "quedan pocas" ni "Agotado" |
| **Estado y canales** | Activo y publicado en *Tienda online* | No se ve en la web |

**Categoría nueva** (p. ej. "Veganos"): crea la colección automática con su etiqueta, añádela
al menú y **avisa a Claude** para darle color, ilustración y texto en el tema.

### Stock
Siempre desde **Productos → Inventario**. Para cambios masivos de stock, usa la exportación e
importación **de inventario** de esa misma pantalla (es un CSV distinto, solo con cantidades).

### Sincronizar la tienda con el repositorio
Hazlo de vez en cuando (p. ej. una vez al mes, o después de cambios grandes):

1. **Exportar:** *Productos → Exportar → Todos los productos → CSV para Excel, Numbers u otro programa*.
   Shopify te envía el archivo por email.
2. **Sincronizar:** pásale el archivo a Claude, o ejecuta:
   ```bash
   node tienda/scripts/sincronizar-desde-shopify.mjs ruta/a/products_export.csv
   ```
3. **Revisar el informe** `tienda/sincronizacion/INFORME.md`. Incluye:
   - ❌ **Errores**: tipo no válido, falta la etiqueta `cat-…`, productos sin imágenes, SKU repetidos.
   - ⚠️ **Avisos**: sin tabla nutricional o sin alérgenos, sin peso, borradores, se puede vender sin stock...
   - 🆕 Productos **creados a mano**, 🗑️ productos **borrados** y ✏️ **cambios** de precio, título, etiquetas o descripción respecto al catálogo inicial.
   - 📦 Variantes con **stock bajo**.
4. **Corrige en Shopify** los errores y avisos, y vuelve a sincronizar si quieres comprobarlo.
5. **Guardar en GitHub** (commit): la copia de la exportación y `catalogo-shopify.json` quedan como
   **copia de seguridad** e historial de cambios del catálogo.

> 🔒 El repositorio `pruebaShopify` es **público**. Las exportaciones de productos no contienen
> datos de clientes, pero si rellenas el **coste por artículo** también quedaría visible. Si eso te
> importa, haz el repositorio privado (GitHub → *Settings → Danger Zone → Change visibility*).
> Ojo: las imágenes del CSV inicial se descargan desde el repositorio, así que hazlo después de
> importarlo.

### Generar CSV seguros para importar
```bash
node tienda/scripts/generar-csv.mjs --solo proteina-vegana,caseina-micelar --sin-stock
```
Solo esos productos y sin columna de stock: actualiza su ficha sin tocar el inventario ni el
resto de productos. Sale en `tienda/sincronizacion/importar.csv`.

```bash
node tienda/scripts/generar-csv.mjs --desde-shopify --sin-stock
```
Regenera el catálogo **tal como está en la tienda** (desde la última sincronización). Sirve para
restaurar fichas, o para cargar el catálogo en otra tienda (por ejemplo, una de pruebas).

| Quiero… | Haz esto |
|---|---|
| Cambiar un precio o una descripción | En Shopify, directamente |
| Añadir 1 o 2 productos | En Shopify, duplicando uno parecido |
| Añadir muchos productos de golpe | Pide a Claude que los añada a `catalogo.mjs` (con sus imágenes) e importa `--solo <nuevos> --sin-stock`, y después pon el stock |
| Subir todos los precios un 5 % | Sincroniza, pide a Claude el cambio sobre `catalogo-shopify.json` e importa `--desde-shopify --sin-stock` |
| Reponer stock | *Productos → Inventario* |
| Tener copia de seguridad | Exporta y sincroniza |

## Orden recomendado (3 tardes)

| Día | Pasos |
|---|---|
| 1 | Pasos 1-4: crear la tienda, configurarla, importar el catálogo y crear las colecciones |
| 2 | Pasos 5-6: elegir y personalizar el tema |
| 3 | Pasos 7-8: páginas, menús, políticas y pedido de prueba |

Cuando la tienda funcione, si un día necesitas algo que Shopify no trae (como el control de
caducidad por lotes), busca una app en la Shopify App Store o encarga una app a medida.
