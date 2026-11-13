// Genera un CSV para Productos → Inventario → Importar, con el stock de ejemplo del catálogo.
// A diferencia del CSV de productos, este SÍ cambia las cantidades de productos que ya existen.
//
//   node tienda/generar-inventario.mjs
//   node tienda/generar-inventario.mjs --ubicacion "Nombre exacto de la ubicación"
//
// "On hand (current)" va a 0: pensado para la carga inicial, con el stock aún vacío.
// La ubicación debe llamarse exactamente igual que en Shopify (Configuración → Ubicaciones).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { escribirCsv } from "./lib/csv.mjs";
import { desdeCatalogo } from "./lib/modelo.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valor = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
const ubicacion = valor("--ubicacion") ?? "Shop location";
const salida = path.resolve(valor("--salida") ?? path.join(DIR, "inventario-vigor.csv"));

const columnas = ["Handle", "Title", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
  "Option3 Name", "Option3 Value", "SKU", "HS Code", "COO", "Location", "Bin name",
  "Incoming (not editable)", "Unavailable (not editable)", "Committed (not editable)",
  "Available (not editable)", "On hand (current)", "On hand (new)"];

const filas = [];
for (const p of desdeCatalogo()) {
  const opciones = p.opciones.length ? p.opciones : [{ nombre: "Title", valores: ["Default Title"] }];
  for (const v of p.variantes) {
    const valores = v.opciones.length ? v.opciones : ["Default Title"];
    const f = Object.fromEntries(columnas.map((c) => [c, ""]));
    Object.assign(f, { Handle: p.handle, Title: p.titulo, SKU: v.sku, Location: ubicacion, "On hand (current)": 0, "On hand (new)": v.stock ?? 0 });
    valores.forEach((val, n) => { f[`Option${n + 1} Name`] = opciones[n].nombre; f[`Option${n + 1} Value`] = val; });
    filas.push(f);
  }
}
writeFileSync(salida, escribirCsv(columnas, filas));
console.log(`${filas.length} variantes, ubicación "${ubicacion}" → ${path.relative(process.cwd(), salida)}`);
