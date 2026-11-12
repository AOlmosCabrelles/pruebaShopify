# Montar la tienda online de Vigor Sport Nutrition (sin programar)

Guía para crear la **web de venta de suplementos** solo con el panel de Shopify:
crear la tienda, elegir el tema, cargar el catálogo y el inventario de ejemplo y dejarla
lista para vender. **No hace falta ninguna app ni escribir código.**

Archivos de esta carpeta:
| Archivo | Para qué |
|---|---|
| `productos-vigor.csv` | Catálogo de ejemplo: 6 productos, 15 variantes, precios, stock, SKU, peso, información nutricional y SEO |
| `GUIA-TIENDA.md` | Esta guía, con los textos listos para copiar y pegar |

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

1. Descarga `productos-vigor.csv` desde GitHub: abre el archivo → botón **Download raw file**.
2. En el admin: **Productos → Importar**.
3. Selecciona el archivo → **Vista previa** → **Importar productos**.
4. En un minuto tendrás esto:

| Producto | Tipo | Variantes | Precio | Stock |
|---|---|---|---|---|
| Whey Protein Isolate | Proteínas | Chocolate / Vainilla / Fresa × 1 kg / 2 kg | 34,90 € / 59,90 € | 3 – 42 uds |
| Creatina Monohidrato | Rendimiento | 300 g / 500 g | 19,90 € / 27,90 € | 60 / 6 |
| Pre-Entreno Explosive | Rendimiento | Limón / Frutos rojos | 29,90 € | 30 / 2 |
| BCAA 2:1:1 | Recuperación | Mango / Neutro | 22,90 € | 22 / 14 |
| Multivitamínico Sport | Salud | 90 cápsulas | 14,90 € | 75 |
| Barritas proteicas (caja de 12) | Snacks | Cookies / Cacahuete | 24,90 € | 9 / 40 |

Cada producto incluye en la descripción la **tabla nutricional**, los **alérgenos en negrita**,
el **modo de empleo** y las advertencias obligatorias.

**Revisa el inventario** en **Productos → Inventario**. Algunas variantes tienen muy poco stock a
propósito (Vainilla 2 kg: 3 uds, Frutos rojos: 2 uds) para que practiques reponer existencias.
La política es *"no vender sin stock"*, así que cuando una variante llega a 0 aparece como **Agotado**.

**Imágenes:** el CSV no trae fotos. Añádelas en cada producto (**Medios → Añadir**) con tus fotos o
con imágenes de bancos libres de derechos. Formato cuadrado, 2048 × 2048 px, fondo blanco o neutro.

## Paso 4 · Colecciones (las categorías de la web)

**Productos → Colecciones → Crear colección.** Elige **Automatizada** con la condición
*"Tipo de producto es igual a…"*:

| Colección | Condición |
|---|---|
| Proteínas | Tipo = `Proteínas` |
| Rendimiento | Tipo = `Rendimiento` |
| Recuperación | Tipo = `Recuperación` |
| Salud | Tipo = `Salud` |
| Snacks | Tipo = `Snacks` |
| Todos los productos | Precio > 0 |

Las colecciones automáticas se rellenan solas cuando añades productos nuevos de ese tipo.

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
| Contacto | Política de privacidad |

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
