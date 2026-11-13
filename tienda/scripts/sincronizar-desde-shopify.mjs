// Sincroniza el repositorio con los productos REALES de la tienda.
//
// 1. En Shopify: Productos → Exportar → "Todos los productos" → "CSV para Excel, Numbers u otro programa".
// 2. Guarda el archivo (o pásaselo a Claude) y ejecuta:
//      node tienda/scripts/sincronizar-desde-shopify.mjs ruta/a/products_export.csv
//
// Resultado (en tienda/sincronizacion/):
//   - exportaciones/productos-AAAA-MM-DD.csv  copia de seguridad de la exportación
//   - catalogo-shopify.json                   los productos de la tienda, en formato del repositorio
//   - INFORME.md                              diferencias con catalogo.mjs y problemas detectados
//
// Después puedes regenerar un CSV desde la tienda con:
//   node tienda/scripts/generar-csv.mjs --desde-shopify --sin-stock
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { leerCsv } from "./lib/csv.mjs";
import { desdeCatalogo, desdeExportacion, TIPOS_VALIDOS, etiquetaCategoria } from "./lib/modelo.mjs";

const TIENDA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SYNC = path.join(TIENDA, "sincronizacion");
const entrada = process.argv[2];
if (!entrada) {
  console.error("Uso: node tienda/scripts/sincronizar-desde-shopify.mjs <exportación-de-shopify.csv>");
  process.exit(1);
}

const tienda = desdeExportacion(leerCsv(readFileSync(entrada, "utf8")));
const repo = desdeCatalogo();
const hoy = new Date().toISOString().slice(0, 10);

// ───────── Copia de seguridad y JSON ─────────
mkdirSync(path.join(SYNC, "exportaciones"), { recursive: true });
copyFileSync(entrada, path.join(SYNC, "exportaciones", `productos-${hoy}.csv`));
writeFileSync(path.join(SYNC, "catalogo-shopify.json"),
  JSON.stringify({ sincronizado: hoy, origen: path.basename(entrada), productos: tienda }, null, 2) + "\n");

// ───────── Comprobaciones de cada producto de la tienda ─────────
const problemas = [];
const avisar = (p, nivel, texto) => problemas.push({ handle: p.handle, titulo: p.titulo, nivel, texto });
const skus = new Map();
for (const p of tienda) {
  if (!TIPOS_VALIDOS.includes(p.tipo))
    avisar(p, "error", `Tipo "${p.tipo || "(vacío)"}" no válido. Usa uno de: ${TIPOS_VALIDOS.join(", ")}.`);
  else if (!p.etiquetas.includes(etiquetaCategoria(p.tipo)))
    avisar(p, "error", `Falta la etiqueta \`${etiquetaCategoria(p.tipo)}\`: no aparecerá en su colección.`);
  if (p.estado !== "active") avisar(p, "aviso", `Estado "${p.estado}": no se ve en la tienda.`);
  if (!p.publicado) avisar(p, "aviso", "No está publicado en la Tienda online.");
  if (!p.imagenes.length) avisar(p, "error", "No tiene imágenes.");
  else if (p.variantes.length > 1 && p.variantes.some((v) => !v.imagen))
    avisar(p, "aviso", "Alguna variante no tiene imagen propia (al cambiar de sabor/tamaño no cambia la foto).");
  if (p.tipo !== "Accesorios" && !/Información nutricional/i.test(p.descripcionHtml))
    avisar(p, "aviso", "La descripción no tiene tabla de *Información nutricional* (obligatoria en complementos).");
  if (p.tipo !== "Accesorios" && !/Alérgenos/i.test(p.descripcionHtml))
    avisar(p, "aviso", "La descripción no indica los *Alérgenos*.");
  for (const v of p.variantes) {
    const nombre = v.opciones.join(" / ") || "única";
    if (!v.sku) avisar(p, "aviso", `Variante ${nombre}: sin SKU.`);
    else if (skus.has(v.sku)) avisar(p, "error", `Variante ${nombre}: SKU ${v.sku} repetido (también en ${skus.get(v.sku)}).`);
    else skus.set(v.sku, p.handle);
    if (!v.gramos && p.tipo !== "Accesorios") avisar(p, "aviso", `Variante ${nombre}: sin peso (la calculadora no puede estimar la duración).`);
    if (v.seguimiento !== "shopify") avisar(p, "aviso", `Variante ${nombre}: sin seguimiento de inventario.`);
    if (v.politica === "continue") avisar(p, "aviso", `Variante ${nombre}: se puede vender sin stock.`);
  }
}

// ───────── Diferencias con catalogo.mjs ─────────
const porHandle = (lista) => new Map(lista.map((p) => [p.handle, p]));
const T = porHandle(tienda), R = porHandle(repo);
const soloTienda = tienda.filter((p) => !R.has(p.handle));
const soloRepo = repo.filter((p) => !T.has(p.handle));
const cambios = [];
const limpio = (h) => h.replace(/\s+/g, " ").trim();
const clave = (v) => v.sku || v.opciones.join("/");
for (const t of tienda) {
  const r = R.get(t.handle);
  if (!r) continue;
  const c = [];
  if (t.titulo !== r.titulo) c.push(`Título: "${r.titulo}" → "${t.titulo}"`);
  if (t.tipo !== r.tipo) c.push(`Tipo: "${r.tipo}" → "${t.tipo}"`);
  const et = (p) => [...p.etiquetas].sort().join(", ");
  if (et(t) !== et(r)) c.push(`Etiquetas: ${et(r)} → ${et(t)}`);
  if (t.estado !== r.estado) c.push(`Estado: ${r.estado} → ${t.estado}`);
  if (limpio(t.descripcionHtml) !== limpio(r.descripcionHtml)) c.push("Descripción modificada");
  const vr = new Map(r.variantes.map((v) => [clave(v), v]));
  const vt = new Map(t.variantes.map((v) => [clave(v), v]));
  for (const [k, v] of vt) {
    const o = vr.get(k);
    if (!o) { c.push(`Variante nueva: ${v.opciones.join(" / ")} (${v.sku || "sin SKU"}, ${v.precio} €)`); continue; }
    if (Number(o.precio) !== Number(v.precio)) c.push(`Precio ${v.sku}: ${o.precio} € → ${v.precio} €`);
    if ((v.precioAnterior || "") !== (o.precioAnterior || "")) c.push(`Precio tachado ${v.sku}: ${o.precioAnterior || "—"} → ${v.precioAnterior || "—"}`);
  }
  for (const [k, v] of vr) if (!vt.has(k)) c.push(`Variante eliminada: ${v.opciones.join(" / ")} (${v.sku})`);
  if (c.length) cambios.push({ p: t, c });
}

// ───────── Stock bajo (informativo) ─────────
const stockBajo = tienda.flatMap((p) => p.variantes.filter((v) => v.stock !== null && v.stock < 5)
  .map((v) => `${p.titulo}${v.opciones.length ? " — " + v.opciones.join(" / ") : ""}: **${v.stock}** uds`));

// ───────── Informe ─────────
const errores = problemas.filter((x) => x.nivel === "error");
const avisos = problemas.filter((x) => x.nivel === "aviso");
const listaProblemas = (lista) => {
  const grupos = new Map();
  for (const x of lista) grupos.set(x.handle, [...(grupos.get(x.handle) ?? []), x]);
  return [...grupos.values()].map((g) => `- **${g[0].titulo}** (\`${g[0].handle}\`)\n${g.map((x) => `  - ${x.texto}`).join("\n")}`).join("\n");
};
const md = `# Informe de sincronización · ${hoy}

Exportación: \`${path.basename(entrada)}\` · Copia guardada en \`exportaciones/productos-${hoy}.csv\`

| | |
|---|---|
| Productos en la tienda | **${tienda.length}** (${tienda.reduce((n, p) => n + p.variantes.length, 0)} variantes) |
| Productos en \`catalogo.mjs\` | ${repo.length} |
| Creados a mano en la tienda | ${soloTienda.length} |
| Borrados en la tienda | ${soloRepo.length} |
| Productos con cambios | ${cambios.length} |
| Errores / avisos | ${errores.length} / ${avisos.length} |

## ❌ Errores (arréglalos en Shopify)
${errores.length ? listaProblemas(errores) : "Ninguno. ✅"}

## ⚠️ Avisos
${avisos.length ? listaProblemas(avisos) : "Ninguno. ✅"}

## 🆕 Productos creados a mano en la tienda
${soloTienda.length ? soloTienda.map((p) => `- **${p.titulo}** (\`${p.handle}\`) · ${p.tipo || "sin tipo"} · ${p.variantes.length} variante(s)`).join("\n") : "Ninguno."}

## 🗑️ Productos del catálogo que ya no están en la tienda
${soloRepo.length ? soloRepo.map((p) => `- **${p.titulo}** (\`${p.handle}\`)`).join("\n") : "Ninguno."}

## ✏️ Cambios hechos a mano respecto a \`catalogo.mjs\`
${cambios.length ? cambios.map(({ p, c }) => `- **${p.titulo}** (\`${p.handle}\`)\n${c.map((x) => `  - ${x}`).join("\n")}`).join("\n") : "Ninguno."}

## 📦 Stock bajo (menos de 5 unidades)
${stockBajo.length ? stockBajo.map((s) => `- ${s}`).join("\n") : "Ninguno."}

---
Los productos de la tienda se han guardado en \`catalogo-shopify.json\`. Para generar un CSV desde ellos sin tocar el stock:
\`node tienda/scripts/generar-csv.mjs --desde-shopify --sin-stock\`
`;
writeFileSync(path.join(SYNC, "INFORME.md"), md);

console.log(`Tienda: ${tienda.length} productos · Errores: ${errores.length} · Avisos: ${avisos.length} · ` +
  `Nuevos a mano: ${soloTienda.length} · Borrados: ${soloRepo.length} · Con cambios: ${cambios.length}`);
console.log(`Informe: ${path.relative(process.cwd(), path.join(SYNC, "INFORME.md"))}`);
