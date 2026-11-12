// Genera tienda/productos-vigor.csv (formato de importación de productos de Shopify)
// a partir de tienda/catalogo.mjs.   Uso: node tienda/generar-csv.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PRODUCTOS, combinar, archivoImagen, descripcionHtml } from "./catalogo.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const URL_IMAGENES = "https://raw.githubusercontent.com/AOlmosCabrelles/pruebaShopify/main/tienda/imagenes/productos/";

const COLUMNAS = ["Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value",
  "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy",
  "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable",
  "Variant Barcode", "Image Src", "Image Position", "Image Alt Text", "Variant Image", "Gift Card", "SEO Title",
  "SEO Description", "Variant Weight Unit", "Status"];

const celda = (v) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const filas = [];
for (const p of PRODUCTOS) {
  combinar(p.opciones).forEach((valores, i) => {
    const v = p.variante(valores);
    const img = URL_IMAGENES + archivoImagen(p, valores) + ".jpg";
    const f = Object.fromEntries(COLUMNAS.map((c) => [c, ""]));
    Object.assign(f, {
      Handle: p.handle,
      "Variant SKU": v.sku, "Variant Grams": v.gramos, "Variant Inventory Tracker": "shopify",
      "Variant Inventory Qty": v.stock, "Variant Inventory Policy": "deny", "Variant Fulfillment Service": "manual",
      "Variant Price": v.precio, "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE", "Variant Weight Unit": "g",
      "Image Src": img, "Image Position": i + 1, "Image Alt Text": `${p.titulo} ${valores.join(" ")}`, "Variant Image": img,
    });
    valores.forEach((val, n) => {
      f[`Option${n + 1} Value`] = val;
      if (i === 0) f[`Option${n + 1} Name`] = p.opciones[n].nombre;
    });
    if (i === 0) {
      Object.assign(f, {
        Title: p.titulo, "Body (HTML)": descripcionHtml(p), Vendor: "Vigor Sport Nutrition", Type: p.tipo, Tags: p.tags,
        Published: "TRUE", "Gift Card": "FALSE", "SEO Title": `${p.seo} | Vigor Sport Nutrition`,
        "SEO Description": p.descripcion.slice(0, 155), Status: "active",
      });
    }
    filas.push(f);
  });
}

const csv = [COLUMNAS.join(","), ...filas.map((f) => COLUMNAS.map((c) => celda(f[c])).join(","))].join("\r\n") + "\r\n";
writeFileSync(path.join(DIR, "productos-vigor.csv"), csv);
console.log(`${PRODUCTOS.length} productos, ${filas.length} variantes → tienda/productos-vigor.csv`);
