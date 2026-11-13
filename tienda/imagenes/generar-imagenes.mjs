// Genera las imágenes de ejemplo de Vigor Sport Nutrition (ilustraciones originales, sin derechos de terceros).
// Uso:  node tienda/imagenes/generar-imagenes.mjs <carpeta-salida>
// Requiere Playwright (Chromium) y ImageMagick (`convert`) para pasar a JPG.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { PRODUCTOS, combinar, archivoImagen } from "../catalogo.mjs";

const OUT = path.resolve(process.argv[2] ?? "imagenes-generadas");
const ACENTO = "#E4572E";
const TINTA = "#111111";

// ---------- Envases (SVG) ----------
function tarro({ id, color, color2 = color, tapa = TINTA, nombre, sabor, peso, dato, escala = 1, claro = false }) {
  const txt = claro ? TINTA : "#ffffff";
  const lineas = nombre.map((l, i) => `<text x="300" y="${385 + i * 43}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="${txt}" letter-spacing="1">${l}</text>`).join("");
  const ultima = 385 + (nombre.length - 1) * 43;
  const pildora = ultima + 20;
  return `
  <g transform="translate(${300 - 300 * escala} ${700 - 700 * escala}) scale(${escala})">
    <defs>
      <linearGradient id="cuerpo-${id}" x1="0" x2="1">
        <stop offset="0" stop-color="#d9d9d9"/><stop offset=".18" stop-color="#ffffff"/><stop offset=".55" stop-color="#f4f4f4"/><stop offset="1" stop-color="#c9c9c9"/>
      </linearGradient>
      <linearGradient id="etiqueta-${id}" x1="0" x2="1">
        <stop offset="0" stop-color="${color2}"/><stop offset=".25" stop-color="${color}"/><stop offset=".7" stop-color="${color}"/><stop offset="1" stop-color="${color2}"/>
      </linearGradient>
      <linearGradient id="tapa-${id}" x1="0" x2="1">
        <stop offset="0" stop-color="#000"/><stop offset=".3" stop-color="${tapa}"/><stop offset="1" stop-color="#000"/>
      </linearGradient>
      <linearGradient id="brillo-${id}" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="690" rx="230" ry="22" fill="#000" opacity=".18"/>
    <path d="M100 150 H500 L486 655 Q485 680 460 680 H140 Q115 680 114 655 Z" fill="url(#cuerpo-${id})"/>
    <path d="M103 225 H497 L490 560 H110 Z" fill="url(#etiqueta-${id})"/>
    <rect x="106" y="534" width="388" height="10" fill="${ACENTO}"/>
    <text x="300" y="300" text-anchor="middle" font-family="Inter" font-weight="900" font-size="78" fill="${txt}" letter-spacing="6">VIGOR</text>
    <text x="300" y="330" text-anchor="middle" font-family="Inter" font-weight="600" font-size="15" fill="${txt}" opacity=".85" letter-spacing="7">SPORT NUTRITION</text>
    ${lineas}
    <rect x="${300 - (sabor.length * 11 + 40) / 2}" y="${pildora}" width="${sabor.length * 11 + 40}" height="38" rx="19" fill="${claro ? TINTA : "#ffffff"}" opacity=".95"/>
    <text x="300" y="${pildora + 26}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="18" fill="${claro ? "#ffffff" : color}" letter-spacing="1">${sabor.toUpperCase()}</text>
    <text x="300" y="${pildora + 68}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="20" fill="${txt}" opacity=".9">${dato}</text>
    <text x="300" y="622" text-anchor="middle" font-family="Inter" font-weight="800" font-size="34" fill="${TINTA}">${peso}</text>
    <rect x="80" y="62" width="440" height="92" rx="16" fill="url(#tapa-${id})"/>
    ${Array.from({ length: 21 }, (_, i) => `<rect x="${94 + i * 20.5}" y="70" width="4" height="76" rx="2" fill="#fff" opacity=".07"/>`).join("")}
    <path d="M170 160 L160 670" stroke="url(#brillo-${id})" stroke-width="40" opacity=".8"/>
  </g>`;
}

function bote({ id, color, capsula, nombre, sabor, peso, dato, escala = 1 }) {
  const cap = capsula ?? color;
  return `
  <g transform="translate(${300 - 300 * escala} ${700 - 700 * escala}) scale(${escala})">
    <defs>
      <linearGradient id="bc-${id}" x1="0" x2="1"><stop offset="0" stop-color="#cfcfcf"/><stop offset=".2" stop-color="#fff"/><stop offset="1" stop-color="#c4c4c4"/></linearGradient>
    </defs>
    <ellipse cx="300" cy="690" rx="170" ry="18" fill="#000" opacity=".18"/>
    <rect x="200" y="70" width="200" height="90" rx="14" fill="${TINTA}"/>
    <path d="M150 190 Q150 160 190 160 H410 Q450 160 450 190 V650 Q450 680 420 680 H180 Q150 680 150 650 Z" fill="url(#bc-${id})"/>
    <rect x="152" y="250" width="296" height="330" fill="${color}"/>
    <rect x="152" y="545" width="296" height="10" fill="${ACENTO}"/>
    <text x="300" y="320" text-anchor="middle" font-family="Inter" font-weight="900" font-size="60" fill="#fff" letter-spacing="5">VIGOR</text>
    <text x="300" y="346" text-anchor="middle" font-family="Inter" font-weight="600" font-size="12" fill="#fff" letter-spacing="6">SPORT NUTRITION</text>
    ${nombre.map((l, i) => `<text x="300" y="${400 + i * 38}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="32" fill="#fff">${l}</text>`).join("")}
    <text x="300" y="${420 + nombre.length * 38}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="18" fill="#fff" opacity=".9">${dato}</text>
    <text x="300" y="530" text-anchor="middle" font-family="Inter" font-weight="800" font-size="20" fill="#fff">${sabor.toUpperCase()}</text>
    <text x="300" y="630" text-anchor="middle" font-family="Inter" font-weight="800" font-size="28" fill="${TINTA}">${peso}</text>
    <path d="M190 175 L190 665" stroke="#fff" stroke-opacity=".5" stroke-width="22"/>
  </g>
  ${[[95, 640, 20], [125, 668, -30], [500, 655, 35], [470, 675, -10]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-26" y="-11" width="52" height="22" rx="11" fill="${cap}"/><rect x="0" y="-11" width="26" height="22" rx="0" fill="#fff" opacity="${capsula ? ".25" : ".55"}"/><rect x="-26" y="-11" width="52" height="22" rx="11" fill="none" stroke="#000" stroke-opacity=".1"/></g>`).join("")}`;
}

function caja({ id, color, sabor, producto = "barra" }) {
  const galleta = (x, y) => `
    <g transform="translate(${x} ${y})">
      <ellipse cx="0" cy="6" rx="92" ry="30" fill="#000" opacity=".15"/>
      <ellipse cx="0" cy="0" rx="92" ry="30" fill="${color}"/>
      <ellipse cx="0" cy="-4" rx="84" ry="24" fill="#fff" opacity=".12"/>
      ${[[-40, -6], [10, -12], [45, 2], [-10, 8], [30, -4]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="9" ry="5" fill="#000" opacity=".35"/>`).join("")}
    </g>`;
  const barra = (x, y, r) => `
    <g transform="translate(${x} ${y}) rotate(${r})">
      <rect x="-150" y="-34" width="300" height="68" rx="12" fill="${color}"/>
      <path d="M-150 -34 h40 l-30 68 h-10 Q-150 34 -150 22 Z" fill="#000" opacity=".15"/>
      <rect x="40" y="-34" width="14" height="68" fill="${ACENTO}"/>
      <text x="-60" y="10" font-family="Inter" font-weight="900" font-size="28" fill="#fff" letter-spacing="3">VIGOR</text>
      <text x="62" y="8" font-family="Inter" font-weight="800" font-size="14" fill="#fff">20 g PROT</text>
    </g>`;
  return `
    <ellipse cx="300" cy="690" rx="250" ry="20" fill="#000" opacity=".18"/>
    <path d="M110 250 L170 200 H530 L470 250 Z" fill="${color}" opacity=".75"/>
    <path d="M470 250 L530 200 V600 L470 650 Z" fill="${color}" opacity=".6"/>
    <rect x="110" y="250" width="360" height="400" fill="${color}"/>
    <rect x="110" y="250" width="360" height="400" fill="url(#cajabrillo)" opacity=".25"/>
    <defs><linearGradient id="cajabrillo" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".4" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs>
    <text x="290" y="340" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#fff" letter-spacing="5">VIGOR</text>
    <text x="290" y="366" text-anchor="middle" font-family="Inter" font-weight="600" font-size="13" fill="#fff" letter-spacing="6">SPORT NUTRITION</text>
    <text x="290" y="425" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">${producto === "galleta" ? "PROTEIN COOKIE" : "PROTEIN BAR"}</text>
    <rect x="${290 - (sabor.length * 11 + 40) / 2}" y="445" width="${sabor.length * 11 + 40}" height="36" rx="18" fill="#fff"/>
    <text x="290" y="470" text-anchor="middle" font-family="Inter" font-weight="800" font-size="17" fill="${color}">${sabor.toUpperCase()}</text>
    <rect x="110" y="505" width="360" height="10" fill="${ACENTO}"/>
    <text x="290" y="560" text-anchor="middle" font-family="Inter" font-weight="800" font-size="24" fill="#fff">${producto === "galleta" ? "12 × 75 g · 15 g proteína" : "12 × 55 g · 20 g proteína"}</text>
    ${producto === "galleta" ? galleta(190, 655) + galleta(410, 668) : barra(200, 640, -8) + barra(420, 660, 6)}`;
}

function shaker({ id, color }) {
  const marcas = [200, 300, 400, 500, 600].map((ml, i) => `<rect x="388" y="${600 - i * 80}" width="26" height="4" fill="#fff" opacity=".8"/><text x="380" y="${606 - i * 80}" text-anchor="end" font-family="Inter" font-weight="700" font-size="16" fill="#fff" opacity=".8">${ml}</text>`).join("");
  return `
    <defs><linearGradient id="sh-${id}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
    <ellipse cx="300" cy="690" rx="170" ry="18" fill="#000" opacity=".18"/>
    <path d="M168 200 H432 L414 660 Q413 680 393 680 H207 Q187 680 186 660 Z" fill="${color}"/>
    <path d="M168 200 H432 L414 660 Q413 680 393 680 H207 Q187 680 186 660 Z" fill="url(#sh-${id})"/>
    ${marcas}
    <g transform="translate(300 450) rotate(-90)"><text x="0" y="22" text-anchor="middle" font-family="Inter" font-weight="900" font-size="72" fill="#fff" letter-spacing="10">VIGOR</text></g>
    <rect x="186" y="608" width="228" height="10" fill="${color === ACENTO ? "#111" : ACENTO}"/>
    <rect x="156" y="120" width="288" height="86" rx="18" fill="#111"/>
    <rect x="230" y="70" width="140" height="60" rx="16" fill="#111"/>
    <rect x="262" y="52" width="76" height="26" rx="10" fill="${color === ACENTO ? "#111" : ACENTO}"/>
    <path d="M200 215 L210 650" stroke="#fff" stroke-opacity=".3" stroke-width="18"/>`;
}

// ---------- Catálogo ----------
const FORMAS = { tarro, bote, caja, shaker };
const P = [];
for (const prod of PRODUCTOS)
  for (const valores of combinar(prod.opciones)) {
    const { forma, ...datos } = prod.imagen(valores);
    P.push({ archivo: archivoImagen(prod, valores), fondo: datos.color, svg: FORMAS[forma]({ id: P.length, ...datos }) });
  }

// ---------- Plantillas HTML ----------
const pagina = (w, h, cuerpo) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;font-family:Inter,sans-serif}
  .lienzo{position:relative;width:${w}px;height:${h}px;overflow:hidden}
</style></head><body><div class="lienzo">${cuerpo}</div></body></html>`;

const fotoProducto = ({ svg, fondo }) => pagina(1600, 1600, `
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 42%, #ffffff 0%, #F4F1EC 55%, #E9E2D6 100%)"></div>
  <div style="position:absolute;left:50%;top:46%;width:1100px;height:1100px;margin:-550px;border-radius:50%;background:${fondo};opacity:.13"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(#E9E2D6,#DED5C6)"></div>
  <svg viewBox="0 0 600 720" style="position:absolute;left:200px;top:180px;width:1200px;height:1440px">${svg}</svg>`);

const grupo = (items, ancho, alto) => `<svg viewBox="0 0 ${items.length * 600} 720" style="width:${ancho}px;height:${alto}px">${items.map((it, i) => `<g transform="translate(${i * 600} 0)">${it}</g>`).join("")}</svg>`;
const buscar = (a) => P.find((p) => p.archivo === a).svg;

const hero = pagina(2400, 1200, `
  <div style="position:absolute;inset:0;background:linear-gradient(115deg,#0d0d0d 0%,#1b1512 55%,#2b1810 100%)"></div>
  <div style="position:absolute;right:-200px;top:-260px;width:1500px;height:1500px;border-radius:50%;background:radial-gradient(circle,${ACENTO}cc 0%,${ACENTO}33 45%,transparent 70%)"></div>
  ${Array.from({ length: 7 }, (_, i) => `<div style="position:absolute;left:${1150 + i * 120}px;top:-200px;width:28px;height:1700px;background:#fff;opacity:.035;transform:rotate(18deg)"></div>`).join("")}
  <div style="position:absolute;right:70px;bottom:60px">${grupo([buscar("barritas-proteicas-cookies"), buscar("creatina-monohidrato-500g"), buscar("whey-protein-isolate-chocolate-2kg"), buscar("pre-entreno-explosive-frutos-rojos")], 1560, 468)}</div>`);

const categoria = (items, color, palabra) => pagina(1000, 1250, `
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,${color} 0%,#111 120%)"></div>
  <div style="position:absolute;left:0;right:0;top:60px;text-align:center;font:900 150px/0.85 Inter;color:#fff;opacity:.12;letter-spacing:-2px;white-space:nowrap">${palabra}</div>
  <div style="position:absolute;right:-180px;bottom:-180px;width:900px;height:900px;border-radius:50%;background:${ACENTO};opacity:.18"></div>
  <div style="position:absolute;left:50%;bottom:120px;transform:translateX(-50%)">${grupo(items, items.length === 1 ? 760 : 980, items.length === 1 ? 912 : 588)}</div>`);

const nosotros = pagina(1800, 1100, `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 85%, #3a1608 0%, #141414 45%, #0b0b0b 100%)"></div>
  ${Array.from({ length: 14 }, (_, i) => `<div style="position:absolute;left:${i * 150 - 200}px;top:-100px;width:22px;height:1400px;background:#fff;opacity:.025;transform:rotate(20deg)"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:110px;text-align:center;font:900 240px/1 Inter;color:${ACENTO};opacity:.2;letter-spacing:20px">VIGOR</div>
  <div style="position:absolute;left:50%;bottom:90px;transform:translateX(-50%)">${grupo(["bcaa-2-1-1-mango", "creatina-monohidrato-300g", "whey-protein-isolate-vainilla-2kg", "pre-entreno-explosive-limon", "multivitaminico-sport-90-capsulas"].map(buscar), 1700, 816)}</div>`);

const logoSvg = (fondo, texto) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 160">
  ${fondo ? `<rect width="620" height="160" fill="${fondo}"/>` : ""}
  <path d="M70 18 L30 92 H66 L54 142 L104 62 H68 L84 18 Z" fill="${ACENTO}"/>
  <text x="128" y="104" font-family="Inter" font-weight="900" font-size="92" letter-spacing="10" fill="${texto}">VIGOR</text>
  <text x="132" y="140" font-family="Inter" font-weight="600" font-size="22" letter-spacing="11.5" fill="${texto}" opacity=".8">SPORT NUTRITION</text>
</svg>`;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="110" fill="${TINTA}"/><path d="M300 60 L150 290 H250 L210 452 L370 210 H270 L330 60 Z" fill="${ACENTO}"/></svg>`;

const social = pagina(1200, 630, `
  <div style="position:absolute;inset:0;background:linear-gradient(115deg,#0d0d0d,#2b1810)"></div>
  <div style="position:absolute;right:-150px;top:-200px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,${ACENTO}aa,transparent 70%)"></div>
  <div style="position:absolute;left:70px;top:90px;width:520px">${logoSvg(null, "#fff").replace("<svg", '<svg width="520"')}</div>
  <div style="position:absolute;left:70px;top:290px;font:900 58px/1.05 Inter;color:#fff">RINDE MÁS.<br>RECUPERA MEJOR.</div>
  <div style="position:absolute;right:40px;bottom:30px">${grupo([buscar("creatina-monohidrato-500g"), buscar("whey-protein-isolate-chocolate-2kg")], 560, 336)}</div>`);

// ---------- Render ----------
const salidas = [
  ...P.map((p) => ({ dir: "productos", nombre: p.archivo, html: fotoProducto(p), w: 1600, h: 1600 })),
  { dir: "tema", nombre: "vigor-hero", html: hero, w: 2400, h: 1200 },
  { dir: "tema", nombre: "vigor-cat-proteinas", html: categoria([buscar("whey-protein-isolate-chocolate-2kg"), buscar("whey-protein-isolate-fresa-1kg")], "#5B3A29", "PROTEÍNA"), w: 1000, h: 1250 },
  { dir: "tema", nombre: "vigor-cat-rendimiento", html: categoria([buscar("creatina-monohidrato-500g"), buscar("pre-entreno-explosive-limon")], "#2D6CDF", "FUERZA"), w: 1000, h: 1250 },
  { dir: "tema", nombre: "vigor-cat-recuperacion", html: categoria([buscar("bcaa-2-1-1-mango")], "#F39237", "RECOVERY"), w: 1000, h: 1250 },
  { dir: "tema", nombre: "vigor-cat-salud", html: categoria([buscar("multivitaminico-sport-90-capsulas")], "#3BA55D", "SALUD"), w: 1000, h: 1250 },
  { dir: "tema", nombre: "vigor-cat-snacks", html: categoria([buscar("barritas-proteicas-cacahuete")], "#C68B3C", "SNACK"), w: 1000, h: 1250 },
  { dir: "tema", nombre: "vigor-cat-accesorios", html: categoria([buscar("shaker-vigor-700-negro"), buscar("shaker-vigor-700-naranja")], "#333333", "SHAKER"), w: 1000, h: 1250 },
  { dir: "tienda", nombre: "sobre-nosotros", html: nosotros, w: 1800, h: 1100 },
  { dir: "tienda", nombre: "compartir-redes", html: social, w: 1200, h: 630 },
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const s of salidas) {
  mkdirSync(path.join(OUT, s.dir), { recursive: true });
  await page.setViewportSize({ width: s.w, height: s.h });
  await page.setContent(s.html);
  const png = path.join(OUT, s.dir, `${s.nombre}.png`);
  await page.screenshot({ path: png });
  execFileSync("convert", [png, "-strip", "-quality", "84", "-sampling-factor", "4:2:0", path.join(OUT, s.dir, `${s.nombre}.jpg`)]);
  unlinkSync(png);
}
// Logo (PNG transparente) y favicon
for (const [nombre, svg, w, h] of [["logo-vigor", logoSvg(null, TINTA), 1240, 320], ["logo-vigor-blanco", logoSvg(null, "#ffffff"), 1240, 320], ["favicon-vigor", favicon, 512, 512]]) {
  writeFileSync(path.join(OUT, "tienda", `${nombre}.svg`), svg);
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg", `<svg width="${w}" height="${h}"`)}</body></html>`);
  await page.screenshot({ path: path.join(OUT, "tienda", `${nombre}.png`), omitBackground: true });
}
await browser.close();
console.log(`Imágenes generadas en ${OUT}`);
