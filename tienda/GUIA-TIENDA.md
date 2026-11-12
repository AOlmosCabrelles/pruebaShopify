# Montar la tienda online de Vigor Sport Nutrition (sin programar)

Guía para crear la **web de venta de suplementos** solo con el panel de Shopify:
crear la tienda, elegir el tema, cargar el catálogo y el inventario de ejemplo y dejarla
lista para vender. **No hace falta ninguna app ni escribir código.**

Archivos de esta carpeta:
| Archivo | Para qué |
|---|---|
| `productos-vigor.csv` | Catálogo de ejemplo: **21 productos, 41 variantes**, con precios, stock, SKU, peso, información nutricional, imágenes y SEO |
| `catalogo.mjs` | Los datos del catálogo. Si cambias algo aquí, regenera el CSV con `node tienda/generar-csv.mjs` |
| `GUIA-TIENDA.md` | Esta guía, con los textos listos para copiar y pegar |
| `imagenes/productos/` | 41 imágenes de envases, una por variante (ya enlazadas en el CSV) |
| `imagenes/marca/` | Logo (oscuro y blanco), favicon, imagen de *Sobre nosotros* e imagen para redes sociales |
| `imagenes/generar-imagenes.mjs` | Script que genera todas las imágenes (por si quieres cambiar colores o textos) |

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
| **Envío y entrega** | Zona *España*: tarifa **Estándar 4,95 €** (48-72 h) y tarifa **Gratis** para pedidos **de más de 50 €** |
| **Pagos** | En la tienda de desarrollo: activa el *proveedor de prueba* (Bogus Gateway). En una tienda real: **Shopify Payments** en modo prueba |
| **Pantalla de pago (checkout)** | Pide nombre y apellidos, y activa la casilla de suscripción a novedades |

## Paso 3 · Importar el catálogo y el inventario

### 3.1 Descargar el CSV
1. Abre https://github.com/AOlmosCabrelles/pruebaShopify/blob/main/tienda/productos-vigor.csv
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
5. En **Tipo de colección**, elige **Automatizada**.
6. En **Condiciones**:
   - *Los productos deben cumplir:* **todas las condiciones**
   - Primer desplegable: **Tipo de producto**
   - Segundo desplegable: **es igual a**
   - Texto: `Proteínas` (con tilde, igual que en el CSV)
7. Pulsa **Guardar**. Abajo aparecerán los 4 productos de proteína.
8. **Comprueba el identificador:** al final de la página, en *Vista previa del listado del motor de
   búsqueda* → **Editar**, la URL debe terminar en `/collections/proteinas`. El tema usa ese
   identificador para la tarjeta de categoría y el botón *Ver proteínas*.

### 4.2 Repetir con el resto
| Título | Condición: Tipo de producto es igual a | Identificador (URL) | Productos |
|---|---|---|---|
| Proteínas | `Proteínas` | `proteinas` | 4 |
| Rendimiento | `Rendimiento` | `rendimiento` | 6 |
| Recuperación | `Recuperación` | `recuperacion` | 3 |
| Salud | `Salud` | `salud` | 4 |
| Snacks | `Snacks` | `snacks` | 3 |
| Accesorios | `Accesorios` | `accesorios` | 1 |

No hace falta crear "Todos los productos": Shopify ya la tiene en `/collections/all`.

### 4.3 Extras opcionales
- **Imagen de la colección:** en cada colección, en el apartado *Imagen de colección*, puedes
  subir la ilustración de su categoría. Están en la rama del tema, en
  [`assets/`](https://github.com/AOlmosCabrelles/pruebaShopify/tree/tema-horizon/assets)
  (`vigor-cat-proteinas.jpg`, etc.). Si usas el tema Vigor no hace falta: ya las muestra solo.
- **Colección "Más vendidos":** Automatizada con la condición *Precio del producto es mayor que 0*
  y ordenada por **Más vendidos**.
- **Colección "Veganos":** Automatizada con la condición *Etiqueta del producto es igual a* `vegana`.

### 4.4 Añadirlas al menú
**Tienda online → Menús → Menú principal** → **Añadir elemento de menú** → escribe el nombre y,
en *Enlace*, elige **Colecciones →** la colección correspondiente. Arrástralas para ordenarlas.

## Paso 5 · Elegir el tema (el diseño)

> ✨ **Atajo:** en la rama [`tema-horizon`](https://github.com/AOlmosCabrelles/pruebaShopify/tree/tema-horizon)
> está Horizon ya adaptado a suplementos (colores, inicio, ficha de producto, calculadora, FAQ...).
> Para usarlo: **Tienda online → Temas → Añadir tema → Conectar desde GitHub** → repositorio
> `pruebaShopify`, rama `tema-horizon`. Los detalles están en el README de esa rama. Si lo usas,
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

### Páginas (**Tienda online → Páginas → Añadir página**)

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

### Menús (**Tienda online → Menús**)
| Menú principal | Menú del pie |
|---|---|
| Inicio | Sobre nosotros |
| Proteínas | Preguntas frecuentes |
| Rendimiento | Contacto |
| Recuperación | Política de envío |
| Salud | Política de reembolso |
| Snacks | Aviso legal |
| Accesorios | Política de privacidad |
| Contacto | |

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

## Orden recomendado (3 tardes)

| Día | Pasos |
|---|---|
| 1 | Pasos 1-4: crear la tienda, configurarla, importar el catálogo y crear las colecciones |
| 2 | Pasos 5-6: elegir y personalizar el tema |
| 3 | Pasos 7-8: páginas, menús, políticas y pedido de prueba |

Cuando la tienda funcione, si un día necesitas algo que Shopify no trae (como el control de
caducidad por lotes), el código de una app de ejemplo está en el resto de este repositorio.
Por ahora puedes ignorarlo.
