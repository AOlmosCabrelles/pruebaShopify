// Fotos reales de producto: si existe un recorte en tienda/imagenes/recortes/, se usa en lugar
// de la ilustración generada.
//
// Nombres de archivo que se buscan, por orden de preferencia:
//   1. <identificador>-<variante>.png|jpg   p. ej. whey-protein-isolate-chocolate-2kg.png  (solo esa variante)
//   2. <identificador>.png|jpg              p. ej. creatina-monohidrato.png               (todas sus variantes)
// PNG con fondo transparente = recorte listo.
// JPG/JPEG/WEBP = foto sobre fondo blanco o liso: el fondo se quita automáticamente.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { archivoImagen } from "../catalogo.mjs";

export const DIR_RECORTES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../imagenes/recortes");
const EXTENSIONES = [".png", ".jpg", ".jpeg", ".webp"];

/** Ruta del recorte real de una variante, o null si no hay. */
export function recorteDe(producto, valores) {
  const base = producto.imagenBase ?? producto.handle;
  const candidatos = [archivoImagen(producto, valores), base, producto.handle];
  for (const nombre of candidatos)
    for (const ext of EXTENSIONES) {
      const ruta = path.join(DIR_RECORTES, nombre + ext);
      if (existsSync(ruta)) return ruta;
    }
  return null;
}

/**
 * Nombre del archivo final de la foto de producto (sin extensión).
 * Las fotos reales llevan el sufijo "-foto" para que su URL sea distinta de la ilustración
 * y Shopify las descargue como imagen nueva al importar.
 */
export const nombreFoto = (producto, valores) =>
  archivoImagen(producto, valores) + (recorteDe(producto, valores) ? "-foto" : "");
