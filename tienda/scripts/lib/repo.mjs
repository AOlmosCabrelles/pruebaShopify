// Repositorio de GitHub donde vive el proyecto, para construir las direcciones públicas de las
// imágenes que Shopify descarga al importar el CSV.
//
// No hay ningún usuario fijado en el código: se detecta del remoto "origin" de git, así que tras
// transferir el repositorio a otra cuenta u organización sigue funcionando sin cambios.
//
// Se puede forzar con variables de entorno:
//   VIGOR_REPO=propietario/repositorio   (p. ej. "MiEmpresa/tienda-cliente")
//   VIGOR_RAMA=main                      (rama de la que se sirven las imágenes)
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function detectarRepo() {
  if (process.env.VIGOR_REPO) return process.env.VIGOR_REPO.replace(/\.git$/, "");
  let url = "";
  try {
    url = execFileSync("git", ["-C", RAIZ, "remote", "get-url", "origin"], { encoding: "utf8" }).trim();
  } catch {
    // sin git o sin remoto
  }
  // https://github.com/propietario/repo(.git) · git@github.com:propietario/repo(.git) · proxies que terminan en /propietario/repo
  const m = url.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?\/?$/) ?? url.match(/\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  if (!m) {
    throw new Error(
      "No se ha podido detectar el repositorio de GitHub (remoto 'origin'). " +
        "Indica cuál es con la variable VIGOR_REPO=propietario/repositorio",
    );
  }
  return `${m[1]}/${m[2]}`;
}

/** Nombre oficial (con sus mayúsculas) según GitHub; si no hay conexión, el del remoto. */
function nombreOficial(repo) {
  try {
    const json = execFileSync("curl", ["-s", "-m", "8", `https://api.github.com/repos/${repo}`], { encoding: "utf8" });
    return JSON.parse(json).full_name ?? repo;
  } catch {
    return repo; // sin conexión o sin curl: se usa tal cual
  }
}

export const REPO = process.env.VIGOR_REPO ? detectarRepo() : nombreOficial(detectarRepo());
export const RAMA = process.env.VIGOR_RAMA || "main";
/** Dirección pública (raw) de un archivo del repositorio, p. ej. urlArchivo("tienda/imagenes/x.jpg") */
export const urlArchivo = (ruta) => `https://raw.githubusercontent.com/${REPO}/${RAMA}/${ruta}`;
