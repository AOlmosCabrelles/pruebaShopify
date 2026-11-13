// Modelo común de producto para el catálogo del repositorio y las exportaciones de Shopify.
//
// Producto normalizado:
// { handle, titulo, descripcionHtml, proveedor, tipo, etiquetas[], publicado, estado,
//   seoTitulo, seoDescripcion, opciones: [{ nombre, valores[] }],
//   variantes: [{ opciones[], sku, precio, precioAnterior, gramos, stock, seguimiento, politica, imagen }],
//   imagenes: [{ url, posicion, alt }] }

import { PRODUCTOS, combinar, descripcionHtml, slugValor } from "../catalogo.mjs";
import { nombreFoto } from "./fotos.mjs";

export const URL_AMBIENTE = "https://raw.githubusercontent.com/AOlmosCabrelles/pruebaShopify/main/tienda/imagenes/ambiente/";
export const URL_IMAGENES = "https://raw.githubusercontent.com/AOlmosCabrelles/pruebaShopify/main/tienda/imagenes/productos-oscuro/";
export const TIPOS_VALIDOS = ["Proteínas", "Rendimiento", "Recuperación", "Salud", "Snacks", "Accesorios"];
export const etiquetaCategoria = (tipo) => `cat-${slugValor(tipo)}`;

// ───────────── Desde catalogo.mjs ─────────────
export function desdeCatalogo() {
  return PRODUCTOS.map((p) => {
    const combinaciones = combinar(p.opciones);
    const variantes = combinaciones.map((valores) => {
      const v = p.variante(valores);
      return {
        opciones: valores, sku: v.sku, precio: v.precio, precioAnterior: "", gramos: v.gramos, stock: v.stock,
        seguimiento: "shopify", politica: "deny", imagen: URL_IMAGENES + nombreFoto(p, valores) + ".jpg",
      };
    });
    return {
      handle: p.handle, titulo: p.titulo, descripcionHtml: descripcionHtml(p), proveedor: "Vigor Sport Nutrition",
      tipo: p.tipo, etiquetas: [etiquetaCategoria(p.tipo), ...p.tags.split(",").map((t) => t.trim())],
      publicado: true, estado: "active", seoTitulo: `${p.seo} | Vigor Sport Nutrition`, seoDescripcion: p.descripcion.slice(0, 155).trim(),
      opciones: p.opciones.map((o) => ({ nombre: o.nombre, valores: o.valores })),
      variantes,
      imagenes: [
        ...variantes.map((v, i) => ({ url: v.imagen, posicion: i + 1, alt: `${p.titulo} ${v.opciones.join(" ")}` })),
        ...(p.ambiente ? [{ url: `${URL_AMBIENTE}extra-${p.ambiente}.jpg`, posicion: variantes.length + 1, alt: `${p.titulo}: foto de ambiente` }] : []),
      ],
    };
  });
}

// ───────────── Desde una exportación de Shopify ─────────────
// Acepta el formato clásico ("Handle", "Variant Price"...) y el nuevo ("URL handle", "Price"...).
const ALIAS = {
  handle: ["handle", "url handle"], titulo: ["title"], cuerpo: ["body (html)", "description"], proveedor: ["vendor"],
  tipo: ["type"], etiquetas: ["tags"], publicado: ["published", "published on online store"], estado: ["status"],
  sku: ["variant sku", "sku"], gramos: ["variant grams", "weight value (grams)"],
  seguimiento: ["variant inventory tracker", "inventory tracker"], stock: ["variant inventory qty", "inventory quantity"],
  politica: ["variant inventory policy", "continue selling when out of stock"],
  precio: ["variant price", "price"], precioAnterior: ["variant compare at price", "compare-at price"],
  imagen: ["image src", "product image url"], posicion: ["image position"], alt: ["image alt text"],
  imagenVariante: ["variant image", "variant image url"], seoTitulo: ["seo title"], seoDescripcion: ["seo description"],
};

function lector(columnas) {
  const indice = new Map(columnas.map((c) => [c.trim().toLowerCase(), c]));
  const buscar = (nombres) => nombres.map((n) => indice.get(n)).find(Boolean);
  const mapa = Object.fromEntries(Object.entries(ALIAS).map(([k, v]) => [k, buscar(v)]));
  for (let n = 1; n <= 3; n++) {
    mapa[`opcion${n}Nombre`] = buscar([`option${n} name`]);
    mapa[`opcion${n}Valor`] = buscar([`option${n} value`]);
  }
  return (fila, campo) => (mapa[campo] ? (fila[mapa[campo]] ?? "").trim() : "");
}

const politicaNormal = (v) => (/^(continue|true)$/i.test(v) ? "continue" : "deny");

export function desdeExportacion({ columnas, filas }) {
  const leer = lector(columnas);
  if (!columnas.some((c) => ["handle", "url handle"].includes(c.trim().toLowerCase())))
    throw new Error("El archivo no parece una exportación de productos de Shopify (falta la columna Handle).");
  const productos = new Map();
  for (const f of filas) {
    const handle = leer(f, "handle");
    if (!handle) continue;
    let p = productos.get(handle);
    if (!p) {
      p = { handle, titulo: "", descripcionHtml: "", proveedor: "", tipo: "", etiquetas: [], publicado: true, estado: "active",
        seoTitulo: "", seoDescripcion: "", opciones: [], variantes: [], imagenes: [] };
      productos.set(handle, p);
    }
    if (leer(f, "titulo")) {
      Object.assign(p, {
        titulo: leer(f, "titulo"), descripcionHtml: leer(f, "cuerpo"), proveedor: leer(f, "proveedor"), tipo: leer(f, "tipo"),
        etiquetas: leer(f, "etiquetas").split(",").map((t) => t.trim()).filter(Boolean),
        publicado: !/^false$/i.test(leer(f, "publicado")), estado: (leer(f, "estado") || "active").toLowerCase(),
        seoTitulo: leer(f, "seoTitulo"), seoDescripcion: leer(f, "seoDescripcion"),
      });
      for (let n = 1; n <= 3; n++) {
        const nombre = leer(f, `opcion${n}Nombre`);
        if (nombre) p.opciones[n - 1] = { nombre, valores: [] };
      }
    }
    const valores = [1, 2, 3].map((n) => leer(f, `opcion${n}Valor`)).filter(Boolean);
    const esVariante = valores.length > 0 || leer(f, "sku") || leer(f, "precio");
    if (esVariante) {
      valores.forEach((v, n) => p.opciones[n] && !p.opciones[n].valores.includes(v) && p.opciones[n].valores.push(v));
      p.variantes.push({
        opciones: valores, sku: leer(f, "sku"), precio: leer(f, "precio"), precioAnterior: leer(f, "precioAnterior"),
        gramos: Number(leer(f, "gramos")) || 0, stock: leer(f, "stock") === "" ? null : Number(leer(f, "stock")),
        seguimiento: leer(f, "seguimiento"), politica: politicaNormal(leer(f, "politica")), imagen: leer(f, "imagenVariante"),
      });
    }
    const img = leer(f, "imagen");
    if (img && !p.imagenes.some((i) => i.url === img))
      p.imagenes.push({ url: img, posicion: Number(leer(f, "posicion")) || p.imagenes.length + 1, alt: leer(f, "alt") });
  }
  // Productos sin opciones: Shopify usa "Title / Default Title"
  for (const p of productos.values()) {
    if (p.opciones.length === 1 && p.opciones[0].nombre === "Title" && p.opciones[0].valores.join() === "Default Title") {
      p.opciones = [];
      p.variantes.forEach((v) => (v.opciones = []));
    }
  }
  return [...productos.values()];
}

// ───────────── A CSV de importación de Shopify ─────────────
export const COLUMNAS = ["Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value",
  "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy",
  "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable",
  "Variant Barcode", "Image Src", "Image Position", "Image Alt Text", "Variant Image", "Gift Card", "SEO Title",
  "SEO Description", "Variant Weight Unit", "Status"];

export const COLUMNAS_IMAGENES = ["Handle", "Title", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
  "Option3 Name", "Option3 Value", "Variant SKU", "Image Src", "Image Position", "Image Alt Text", "Variant Image"];

/**
 * @param {{ sinStock?: boolean, soloImagenes?: boolean }} opciones
 *   sinStock: quita la columna de stock para no pisar el inventario real.
 *   soloImagenes: solo las columnas necesarias para cambiar las imágenes (no toca precios, textos ni stock).
 */
export function aFilasCsv(productos, { sinStock = false, soloImagenes = false } = {}) {
  const base = sinStock ? COLUMNAS.filter((c) => c !== "Variant Inventory Qty") : COLUMNAS;
  const columnas = soloImagenes ? COLUMNAS_IMAGENES : base;
  const filas = [];
  for (const p of productos) {
    const opciones = p.opciones.length ? p.opciones : [{ nombre: "Title", valores: ["Default Title"] }];
    const usadas = new Set();
    p.variantes.forEach((v, i) => {
      const valores = v.opciones.length ? v.opciones : ["Default Title"];
      const f = Object.fromEntries(columnas.map((c) => [c, ""]));
      Object.assign(f, {
        Handle: p.handle, "Variant SKU": v.sku, "Variant Grams": v.gramos, "Variant Inventory Tracker": v.seguimiento,
        "Variant Inventory Policy": v.politica, "Variant Fulfillment Service": "manual", "Variant Price": v.precio,
        "Variant Compare At Price": v.precioAnterior, "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE",
        "Variant Weight Unit": "g", "Variant Image": v.imagen,
      });
      if (!sinStock) f["Variant Inventory Qty"] = v.stock ?? "";
      // Imagen: la de la variante, o la siguiente imagen del producto que no se haya usado
      const img = p.imagenes.find((x) => x.url === v.imagen) ?? (p.imagenes[i] && !usadas.has(p.imagenes[i].url) ? p.imagenes[i] : undefined);
      if (img) { usadas.add(img.url); Object.assign(f, { "Image Src": img.url, "Image Position": img.posicion, "Image Alt Text": img.alt }); }
      valores.forEach((val, n) => {
        f[`Option${n + 1} Value`] = val;
        if (i === 0) f[`Option${n + 1} Name`] = opciones[n].nombre;
      });
      if (i === 0) {
        Object.assign(f, {
          Title: p.titulo, "Body (HTML)": p.descripcionHtml, Vendor: p.proveedor, Type: p.tipo, Tags: p.etiquetas.join(", "),
          Published: p.publicado ? "TRUE" : "FALSE", "Gift Card": "FALSE", "SEO Title": p.seoTitulo,
          "SEO Description": p.seoDescripcion, Status: p.estado,
        });
      }
      filas.push(f);
    });
    // Imágenes extra (sin variante): una fila solo con la imagen
    for (const img of p.imagenes.filter((x) => !usadas.has(x.url))) {
      const f = Object.fromEntries(columnas.map((c) => [c, ""]));
      Object.assign(f, { Handle: p.handle, "Image Src": img.url, "Image Position": img.posicion, "Image Alt Text": img.alt });
      filas.push(f);
    }
  }
  if (soloImagenes) {
    const recortar = (f) => Object.fromEntries(columnas.map((c) => [c, f[c] ?? ""]));
    return { columnas, filas: filas.map(recortar) };
  }
  return { columnas, filas };
}
