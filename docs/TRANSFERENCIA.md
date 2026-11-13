# Transferir el proyecto a otro mantenedor

Objetivo: que el nuevo mantenedor (o el cliente) sea **propietario del repositorio** y tú dejes de
estar en el flujo, sin que la tienda deje de funcionar.

El proyecto está preparado para ello:
- **El tema** (rama `tema-horizon`) no contiene ninguna referencia a una cuenta concreta.
- **Las herramientas** (`tienda/`) detectan solas en qué repositorio están para construir las
  direcciones de las imágenes (`tienda/scripts/lib/repo.mjs`): tras la transferencia funcionan igual.
- **La documentación** usa enlaces relativos.

---

## Antes de empezar: dos avisos importantes

### 1. La conexión Shopify ↔ GitHub está ligada a la cuenta que la hizo
La sincronización del tema la autorizó una cuenta de GitHub. **Si es la tuya, al transferir el
repositorio y retirarte, el tema dejará de sincronizarse** (la tienda sigue funcionando con la
última versión, pero los cambios en GitHub ya no llegan). Por eso el paso 3 es **reconectar el tema
con la cuenta del nuevo propietario**.

### 2. Repositorio privado = las importaciones con imágenes desde GitHub dejan de funcionar
Los CSV enlazan las fotos con direcciones públicas de GitHub (`raw.githubusercontent.com`). Si el
nuevo propietario hace el repositorio **privado**, Shopify no podrá descargarlas en **futuras**
importaciones. Las fotos ya importadas no se ven afectadas: Shopify guarda su propia copia.
Opciones si se quiere privado: subir las fotos nuevas desde el admin (*Medios*) o alojar las
imágenes en *Contenido → Archivos* de Shopify.

---

## Paso 1 · Transferir el repositorio (lo haces tú)

1. En GitHub, abre el repositorio → **Settings** → abajo del todo, **Danger Zone** →
   **Transfer ownership**.
2. Escribe la cuenta de destino:
   - **El usuario de GitHub** del nuevo mantenedor, o
   - **Una organización** (recomendado si el propietario final es el cliente: el cliente crea una
     organización gratuita y los mantenedores entran y salen como miembros, sin volver a transferir).
3. Confirma escribiendo el nombre del repositorio.
4. Si el destino es un usuario, **recibirá un email y debe aceptar** la transferencia.

Se conserva todo: ramas (`main` y `tema-horizon`), historial de commits, issues y pull requests.
GitHub redirige automáticamente las direcciones antiguas al nuevo propietario.

## Paso 2 · El nuevo propietario revisa permisos

En **Settings → Collaborators** (o los miembros de la organización), el nuevo propietario decide
quién tiene acceso. Si sigues apareciendo y ya no debes, que te **quite**. Recomendado también:
**Settings → Branches** → proteger `main` y `tema-horizon` (exigir pull request).

## Paso 3 · Reconectar el tema en Shopify con la cuenta del nuevo propietario

1. El nuevo propietario, con **su** cuenta de GitHub: en Shopify, **Tienda online → Temas →
   Añadir tema → Conectar desde GitHub** → autoriza a Shopify → elige el repositorio ya transferido
   → rama **`tema-horizon`** → **Conectar**.
2. Aparece en la biblioteca como un tema nuevo con **todos los ajustes** (los textos, colores y
   secciones del editor viven en los archivos JSON del repositorio).
3. **Vista previa** para comprobar que se ve igual → **⋯ → Publicar**.
4. El tema antiguo (conectado con tu cuenta) queda en la biblioteca: **⋯ → Eliminar** cuando se
   haya comprobado el nuevo.
5. En GitHub, en **tu** cuenta: *Settings → Applications → Installed GitHub Apps* → si la app de
   Shopify ya no tiene ningún repositorio tuyo que necesite, **desinstálala**.

## Paso 4 · Shopify: quitar tu acceso a la tienda

El propietario de la tienda: **Configuración → Usuarios** → en *Colaboradores* (o en *Personal*),
elimina tu acceso y añade al nuevo mantenedor como colaborador con los permisos que necesite.

## Paso 5 · Copias locales

Quien tenga el repositorio clonado puede seguir trabajando (GitHub redirige), pero es mejor
actualizar la dirección:

```bash
git remote set-url origin https://github.com/<nuevo-propietario>/<repositorio>.git
```

Comprobación de que las herramientas detectan el nuevo repositorio:

```bash
node --input-type=module -e "import {REPO} from './tienda/scripts/lib/repo.mjs'; console.log(REPO)"
```

---

## Checklist final: "ya no estoy en el flujo"

- [ ] El repositorio pertenece al nuevo propietario (usuario u organización)
- [ ] No soy colaborador del repositorio (o solo con el acceso que el propietario decida)
- [ ] El tema publicado está conectado a GitHub con la cuenta del nuevo propietario
- [ ] El tema antiguo, conectado con mi cuenta, está eliminado
- [ ] No tengo acceso a la tienda Shopify
- [ ] La app de Shopify en mi cuenta de GitHub está desinstalada (si no la uso para otros proyectos)
- [ ] El nuevo mantenedor ha hecho un cambio de prueba en la rama del tema y se ha visto en la tienda

## Qué necesita saber el nuevo mantenedor

| Documento | Para qué |
|---|---|
| `README.md` (rama `main`) | Visión general del proyecto |
| `docs/GUIA-TIENDA.md` | Montaje y mantenimiento de la tienda (paso 10: catálogo y sincronización) |
| `README.md` (rama `tema-horizon`) | Qué se ha cambiado sobre Horizon y qué secciones nuevas hay |
| `tienda/imagenes/recortes/README.md` | Cómo añadir fotos reales de producto |
| `tienda/imagenes/banco/CREDITOS.md` | Licencias de las fotos de banco de imágenes (hay que mantener los créditos) |
| `tienda/scripts/validar-ajustes-tema.py` | Validar el tema antes de subir cambios (Shopify rechaza en silencio valores no válidos) |

Requisitos para usar las herramientas de `tienda/`: **Node.js 22+**, **Python 3**,
**ImageMagick** (`convert`) y, para generar imágenes, **Playwright con Chromium**. El día a día de la
tienda (productos, stock, textos, menús) no necesita ninguna: se hace desde el admin de Shopify.
