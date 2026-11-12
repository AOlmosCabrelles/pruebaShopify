import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { CATALOGO } from "../data/catalogo.server";
import { cargarCatalogo } from "../services/catalogo.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return {
    productos: CATALOGO.map((p) => ({
      titulo: p.titulo,
      tipo: p.tipo,
      variantes: p.variantes.length,
    })),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  return cargarCatalogo(admin, session.shop);
};

export default function Catalogo() {
  const { productos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const cargando = fetcher.state !== "idle";
  const r = fetcher.data;

  return (
    <s-page heading="Catálogo de prueba">
      <s-section heading="Vigor Sport Nutrition (tienda ficticia)">
        <s-paragraph>
          Crea en tu tienda de desarrollo los productos de suplementación con sus
          variantes, stock, metafields nutricionales, colecciones y lotes de
          ejemplo. Puedes ejecutarlo varias veces: actualiza en lugar de
          duplicar.
        </s-paragraph>
        <s-table>
          <s-table-header-row>
            <s-table-header>Producto</s-table-header>
            <s-table-header>Tipo</s-table-header>
            <s-table-header format="numeric">Variantes</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {productos.map((p) => (
              <s-table-row key={p.titulo}>
                <s-table-cell>{p.titulo}</s-table-cell>
                <s-table-cell>{p.tipo}</s-table-cell>
                <s-table-cell>{p.variantes}</s-table-cell>
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
        <s-box paddingBlockStart="base">
          <s-button
            variant="primary"
            onClick={() => fetcher.submit({}, { method: "POST" })}
            {...(cargando ? { loading: true } : {})}
          >
            Cargar catálogo en la tienda
          </s-button>
        </s-box>
      </s-section>

      {r && (
        <s-section heading="Resultado">
          <s-banner tone={r.errores.length ? "warning" : "success"}>
            <s-paragraph>
              {r.productos.length} productos, {r.colecciones.length} colecciones
              nuevas, {r.metafields} definiciones de metafield nuevas y {r.lotes}{" "}
              lotes.
            </s-paragraph>
          </s-banner>
          {r.errores.length > 0 && (
            <s-unordered-list>
              {r.errores.map((e) => (
                <s-list-item key={e}>{e}</s-list-item>
              ))}
            </s-unordered-list>
          )}
        </s-section>
      )}
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
