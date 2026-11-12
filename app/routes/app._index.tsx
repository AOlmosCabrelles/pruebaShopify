import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {
  diasHasta,
  obtenerAjustes,
  variantesConStockBajo,
} from "../services/inventario.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const ajustes = await obtenerAjustes(session.shop);

  const limite = new Date();
  limite.setDate(limite.getDate() + ajustes.diasCaducidad);

  const [lotes, stockBajo, totalLotes] = await Promise.all([
    db.lote.findMany({
      where: { shop: session.shop, caducidad: { lte: limite }, unidades: { gt: 0 } },
      orderBy: { caducidad: "asc" },
    }),
    variantesConStockBajo(admin, ajustes.umbralStock),
    db.lote.count({ where: { shop: session.shop } }),
  ]);

  return {
    ajustes,
    totalLotes,
    stockBajo,
    lotes: lotes.map((l) => ({ ...l, dias: diasHasta(l.caducidad) })),
  };
};

function toneCaducidad(dias: number) {
  if (dias <= 0) return "critical" as const;
  if (dias <= 30) return "warning" as const;
  return "caution" as const;
}

export default function Panel() {
  const { ajustes, lotes, stockBajo, totalLotes } = useLoaderData<typeof loader>();

  return (
    <s-page heading="Vigor Manager">
      <s-button slot="primary-action" href="/app/lotes">
        Registrar lote
      </s-button>

      {totalLotes === 0 && (
        <s-banner tone="info" heading="Tu tienda aún no tiene datos">
          <s-paragraph>
            Carga el catálogo de suplementos de ejemplo para empezar el simulacro.
          </s-paragraph>
          <s-button slot="secondary-actions" href="/app/catalogo">
            Ir a Catálogo de prueba
          </s-button>
        </s-banner>
      )}

      <s-section heading={`⏳ Lotes que caducan en ${ajustes.diasCaducidad} días o menos`}>
        {lotes.length === 0 ? (
          <s-paragraph>Ningún lote próximo a caducar. 💪</s-paragraph>
        ) : (
          <s-table>
            <s-table-header-row>
              <s-table-header>Producto</s-table-header>
              <s-table-header>Lote</s-table-header>
              <s-table-header format="numeric">Unidades</s-table-header>
              <s-table-header>Caducidad</s-table-header>
              <s-table-header>Estado</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {lotes.map((l) => (
                <s-table-row key={l.id}>
                  <s-table-cell>{l.productName}</s-table-cell>
                  <s-table-cell>{l.codigoLote}</s-table-cell>
                  <s-table-cell>{l.unidades}</s-table-cell>
                  <s-table-cell>
                    {new Date(l.caducidad).toLocaleDateString("es-ES")}
                  </s-table-cell>
                  <s-table-cell>
                    <s-badge tone={toneCaducidad(l.dias)}>
                      {l.dias <= 0 ? "Caducado" : `${l.dias} días`}
                    </s-badge>
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        )}
      </s-section>

      <s-section heading={`📦 Stock por debajo de ${ajustes.umbralStock} unidades`}>
        {stockBajo.length === 0 ? (
          <s-paragraph>Todo el catálogo tiene stock suficiente.</s-paragraph>
        ) : (
          <s-table>
            <s-table-header-row>
              <s-table-header>Producto</s-table-header>
              <s-table-header>SKU</s-table-header>
              <s-table-header format="numeric">Stock</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {stockBajo.map((v) => (
                <s-table-row key={v.id}>
                  <s-table-cell>{v.nombre}</s-table-cell>
                  <s-table-cell>{v.sku}</s-table-cell>
                  <s-table-cell>
                    <s-badge tone={v.stock <= 3 ? "critical" : "warning"}>
                      {String(v.stock)}
                    </s-badge>
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        )}
      </s-section>

      <s-section slot="aside" heading="Resumen">
        <s-paragraph>
          <s-text>Lotes registrados: </s-text>
          <s-text type="strong">{String(totalLotes)}</s-text>
        </s-paragraph>
        <s-paragraph>
          <s-text>Próximos a caducar: </s-text>
          <s-text type="strong">{String(lotes.length)}</s-text>
        </s-paragraph>
        <s-paragraph>
          <s-text>Variantes con stock bajo: </s-text>
          <s-text type="strong">{String(stockBajo.length)}</s-text>
        </s-paragraph>
        <s-link href="/app/ajustes">Cambiar umbrales</s-link>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
