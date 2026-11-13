// Procesa las fotos de banco de imágenes con el estilo de la marca Vigor.
//
//   node tienda/imagenes/procesar-fotos-banco.mjs
//
// Lee tienda/imagenes/banco/fotos.json y las fotos originales de tienda/imagenes/banco/originales/,
// y genera:
//   - tienda/imagenes/banco/tema/      → banner, categorías y "Sobre nosotros" (se copian a assets del tema)
//   - tienda/imagenes/ambiente/        → segundas fotos de producto (las enlaza el CSV)
//   - tienda/imagenes/banco/CREDITOS.md y creditos.html (autoría y licencias, obligatorio en CC BY)
//
// Retoque común: recorte al formato, menos saturación, más contraste, tono rojo fuego y viñeta.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BANCO = path.join(DIR, "banco");
const fotos = JSON.parse(readFileSync(path.join(BANCO, "fotos.json"), "utf8"));
const ACENTO = "#FF3D00";

const FORMATOS = {
  banner: { w: 2000, h: 1000, carpeta: "banco/tema" },
  categoria: { w: 1000, h: 1250, carpeta: "banco/tema" },
  nosotros: { w: 1800, h: 1100, carpeta: "banco/tema" },
  producto: { w: 1600, h: 1600, carpeta: "ambiente" },
};

const LICENCIAS = {
  cc0: "CC0 (dominio público)", pdm: "Marca de dominio público",
  by: "CC BY", "by-sa": "CC BY-SA",
};

for (const [nombre, f] of Object.entries(fotos)) {
  const formato = FORMATOS[f.formato];
  const origen = path.join(BANCO, "originales", f.archivo);
  if (!existsSync(origen)) { console.warn(`Falta ${f.archivo}, se omite`); continue; }
  const destinoDir = path.join(DIR, formato.carpeta);
  mkdirSync(destinoDir, { recursive: true });
  const destino = path.join(destinoDir, `${nombre}.jpg`);
  const { w, h } = formato;
  const foco = f.foco ?? "center"; // gravity de ImageMagick: center, north, south, east, west...
  execFileSync("convert", [
    origen, "-auto-orient", "-colorspace", "sRGB",
    "-resize", `${w}x${h}^`, "-gravity", foco, "-extent", `${w}x${h}`,
    // Menos color, más contraste, un poco más oscuro
    "-modulate", `${f.brillo ?? 96},${f.saturacion ?? 70},100`,
    "-sigmoidal-contrast", "3.5,48%",
    // Tono rojo fuego
    "(", "+clone", "-fill", ACENTO, "-colorize", "100", ")",
    "-compose", "blend", "-define", `compose:args=${f.tono ?? 10}`, "-composite",
    // Viñeta
    "(", "-size", "1000x1000", "radial-gradient:white-black", "-resize", `${w}x${h}!`, "+level", `${f.vineta ?? 62}%,100%`, ")",
    "-compose", "multiply", "-composite",
    "-strip", "-quality", "84", "-sampling-factor", "4:2:0", destino,
  ]);
  console.log(`✓ ${path.relative(DIR, destino)}`);
}

// ───────── Créditos ─────────
const filas = Object.entries(fotos).map(([nombre, f]) => ({ nombre, ...f, licenciaTexto: LICENCIAS[f.licencia] ?? f.licencia }));
const md = `# Créditos de las fotos de banco de imágenes

Fotos obtenidas con [Openverse](https://openverse.org) con licencias que permiten el uso comercial.
Se han **recortado y retocado** (color, contraste, tono y viñeta) para la marca de ejemplo Vigor.
Las licencias CC BY y CC BY-SA **obligan a citar al autor**: esta lista debe publicarse en la
tienda (página *Créditos de imágenes*, enlazada desde el pie).

| Uso | Foto | Autor | Licencia | Fuente |
|---|---|---|---|---|
${filas.map((f) => `| ${f.uso} | ${f.titulo} | ${f.autor ?? "—"} | ${f.licenciaTexto}${f.version ? " " + f.version : ""} | [enlace](${f.origen}) |`).join("\n")}
`;
writeFileSync(path.join(BANCO, "CREDITOS.md"), md);

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const html = `<p>Algunas fotos de esta web proceden de bancos de imágenes con licencias abiertas. Se han recortado y retocado (color y contraste) para adaptarlas al estilo de la marca.</p>
<ul>
${filas.map((f) => `  <li><strong>${esc(f.uso)}:</strong> «${esc(f.titulo)}»${f.autor ? ` de ${esc(f.autor)}` : ""}, ${esc(f.licenciaTexto)}${f.version ? " " + esc(f.version) : ""}${f.licencia_url ? ` (<a href="${f.licencia_url}" target="_blank" rel="noopener">licencia</a>)` : ""}, <a href="${f.origen}" target="_blank" rel="noopener">fuente</a>.</li>`).join("\n")}
</ul>`;
writeFileSync(path.join(BANCO, "creditos.html"), html + "\n");
console.log("✓ banco/CREDITOS.md y banco/creditos.html");
