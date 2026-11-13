// Genera un CSV de importación de productos de Shopify.
//
//   node tienda/generar-csv.mjs
//       → tienda/productos-vigor.csv desde tienda/catalogo.mjs (catálogo inicial, con stock)
//
//   node tienda/generar-csv.mjs --desde-shopify
//       → desde la última exportación sincronizada (tienda/sincronizacion/catalogo-shopify.json)
//
// Opciones:
//   --sin-stock        quita la columna de stock (para reimportar SIN pisar el inventario real)
//   --solo-imagenes    solo identificador, variantes e imágenes (para cambiar las fotos sin tocar nada más)
//   --solo-stock       solo identificador, variantes y stock (para poner el stock de ejemplo sin tocar nada más)
//   --solo a,b,c       solo esos productos (por su identificador / handle)
//   --salida ruta.csv  archivo de salida
//
// Ejemplo seguro para subir solo un producto nuevo a una tienda en marcha:
//   node tienda/generar-csv.mjs --solo proteina-vegana --sin-stock
//
// Cambiar solo las fotos de todos los productos:
//   node tienda/generar-csv.mjs --solo-imagenes --salida tienda/productos-vigor-imagenes.csv
//
// Poner el stock de ejemplo en todas las variantes:
//   node tienda/generar-csv.mjs --solo-stock --salida tienda/productos-vigor-stock.csv
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { escribirCsv } from "./lib/csv.mjs";
import { desdeCatalogo, aFilasCsv } from "./lib/modelo.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valor = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
const desdeShopify = args.includes("--desde-shopify");
const sinStock = args.includes("--sin-stock");
const soloImagenes = args.includes("--solo-imagenes");
const soloStock = args.includes("--solo-stock");
const solo = valor("--solo")?.split(",").map((h) => h.trim()).filter(Boolean);

let productos;
if (desdeShopify) {
  const ruta = path.join(DIR, "sincronizacion", "catalogo-shopify.json");
  productos = JSON.parse(readFileSync(ruta, "utf8")).productos;
} else {
  productos = desdeCatalogo();
}
if (solo) {
  const faltan = solo.filter((h) => !productos.some((p) => p.handle === h));
  if (faltan.length) { console.error(`No existen estos productos: ${faltan.join(", ")}`); process.exit(1); }
  productos = productos.filter((p) => solo.includes(p.handle));
}

const porDefecto = !desdeShopify && !solo && !sinStock && !soloImagenes && !soloStock
  ? path.join(DIR, "productos-vigor.csv")
  : path.join(DIR, "sincronizacion", "importar.csv");
const salida = path.resolve(valor("--salida") ?? porDefecto);
mkdirSync(path.dirname(salida), { recursive: true });

const { columnas, filas } = aFilasCsv(productos, { sinStock, soloImagenes, soloStock });
writeFileSync(salida, escribirCsv(columnas, filas));
console.log(`${productos.length} productos, ${filas.length} filas${soloStock ? " (solo stock)" : soloImagenes ? " (solo imágenes)" : sinStock ? " (sin stock)" : ""} → ${path.relative(process.cwd(), salida)}`);
