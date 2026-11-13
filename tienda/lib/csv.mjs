// Utilidades CSV sin dependencias (compatibles con los CSV de Shopify).

/** Convierte texto CSV en una lista de objetos { columna: valor }. Soporta comillas, comas y saltos de línea. */
export function leerCsv(texto) {
  const filas = [];
  let fila = [];
  let campo = "";
  let comillas = false;
  texto = texto.replace(/^﻿/, ""); // BOM de Excel
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; } else comillas = false;
      } else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(campo); campo = "";
      if (fila.some((v) => v !== "")) filas.push(fila);
      fila = [];
    } else campo += c;
  }
  if (campo !== "" || fila.length) { fila.push(campo); if (fila.some((v) => v !== "")) filas.push(fila); }
  const [cabecera, ...resto] = filas;
  return { columnas: cabecera, filas: resto.map((f) => Object.fromEntries(cabecera.map((c, n) => [c, f[n] ?? ""]))) };
}

const celda = (v) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Escribe una lista de objetos como CSV con las columnas indicadas (formato Shopify: CRLF). */
export const escribirCsv = (columnas, filas) =>
  [columnas.join(","), ...filas.map((f) => columnas.map((c) => celda(f[c])).join(","))].join("\r\n") + "\r\n";
