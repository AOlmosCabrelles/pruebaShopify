# Backlog del simulacro

Crea estas issues en GitHub (pestaña **Issues → New issue**, o desde VS Code con la
extensión *GitHub Pull Requests → Issues → +*). Cada una se trabaja en su propia rama y
se cierra con un Pull Request que diga `Cierra #N`.

Las marcadas con ✅ ya están implementadas en este repositorio; puedes usarlas para
practicar el flujo leyendo el código o rehaciéndolas desde cero en una rama nueva.

| # | Issue | Rama | Estado |
|---|---|---|---|
| 1 | Configurar repositorio, CI y `.vscode/` | `chore/setup` | ✅ |
| 2 | Cargar catálogo de suplementos de prueba | `feature/seed-catalogo` | ✅ |
| 3 | Modelo `Lote` y panel de caducidades | `feature/lotes-caducidad` | ✅ |
| 4 | Formulario de alta y baja de lotes | `feature/alta-lotes` | ✅ |
| 5 | Calculadora de proteína en la ficha de producto | `feature/calculadora` | ✅ |
| 6 | Descuento automático pack proteína + creatina | `feature/pack-descuento` | ✅ |
| 7 | Webhooks RGPD y desinstalación | `feature/webhooks` | ✅ |
| 8 | Descontar unidades del lote más antiguo al recibir un pedido (FEFO) | `feature/fefo-pedidos` | 🔲 reto |
| 9 | Crear un descuento de "liquidación" para lotes a < 30 días de caducar | `feature/liquidacion-lotes` | 🔲 reto |
| 10 | Aviso por email semanal con lotes y stock bajo | `feature/email-semanal` | 🔲 reto |
| 11 | Cambiar SQLite por Postgres para producción | `chore/postgres` | 🔲 reto |

## Detalle de los retos

### #8 FEFO al recibir pedidos
*First Expired, First Out*: el lote que antes caduca es el primero que sale.
- [ ] Añadir el scope `read_orders` y el webhook `orders/create` en `shopify.app.toml`
- [ ] Ruta `app/routes/webhooks.orders.create.tsx` que, por cada línea, reste unidades del lote con la caducidad más próxima
- [ ] Test unitario de la función de reparto entre lotes

### #9 Liquidación de lotes
- [ ] Botón "Crear liquidación" en el panel para un lote concreto
- [ ] Mutación `discountAutomaticBasicCreate` limitada a esa variante, con fecha de fin = caducidad

### #10 Email semanal
- [ ] Tarea programada (p. ej. un cron de GitHub Actions que llame a un endpoint protegido)
- [ ] Plantilla de email con el resumen del panel

### #11 Postgres
- [ ] `provider = "postgresql"` en `prisma/schema.prisma` y `url = env("DATABASE_URL")`
- [ ] Regenerar las migraciones y añadir `DATABASE_URL` en el hosting
- [ ] Servicio de Postgres en la CI (`services:` en `ci.yml`)
