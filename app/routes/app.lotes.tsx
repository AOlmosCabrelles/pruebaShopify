import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { diasHasta, listarVariantes } from "../services/inventario.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const [variantes, lotes] = await Promise.all([
    listarVariantes(admin),
    db.lote.findMany({
      where: { shop: session.shop },
      orderBy: { caducidad: "asc" },
    }),
  ]);
  return {
    variantes,
    lotes: lotes.map((l) => ({ ...l, dias: diasHasta(l.caducidad) })),
  };
};

type ActionData = { ok: boolean; mensaje: string };

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionData> => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "borrar") {
    await db.lote.deleteMany({
      where: { id: Number(form.get("id")), shop: session.shop },
    });
    return { ok: true, mensaje: "Lote eliminado" };
  }

  const variante = String(form.get("variante") ?? "");
  const [variantId, sku, ...resto] = variante.split("|");
  const productName = resto.join("|");
  const codigoLote = String(form.get("codigoLote") ?? "").trim();
  const caducidadTxt = String(form.get("caducidad") ?? "");
  const unidades = Number(form.get("unidades"));

  if (!variantId || !codigoLote || !caducidadTxt || !(unidades >= 0)) {
    return { ok: false, mensaje: "Rellena todos los campos" };
  }

  const caducidad = new Date(`${caducidadTxt}T00:00:00`);
  await db.lote.upsert({
    where: {
      shop_variantId_codigoLote: { shop: session.shop, variantId, codigoLote },
    },
    update: { caducidad, unidades },
    create: {
      shop: session.shop,
      variantId,
      sku,
      productName,
      codigoLote,
      caducidad,
      unidades,
    },
  });
  return { ok: true, mensaje: `Lote ${codigoLote} guardado` };
};

export default function Lotes() {
  const { variantes, lotes } = useLoaderData<typeof loader>();
  const resultado = useActionData<typeof action>();
  const navigation = useNavigation();
  const shopify = useAppBridge();
  const enviando = navigation.state === "submitting";

  useEffect(() => {
    if (resultado) shopify.toast.show(resultado.mensaje, { isError: !resultado.ok });
  }, [resultado, shopify]);

  return (
    <s-page heading="Lotes y caducidad">
      <s-section heading="Registrar un lote">
        <Form method="post">
          <input type="hidden" name="intent" value="guardar" />
          <s-stack gap="base">
            <s-select label="Producto / variante" name="variante" required>
              {variantes.map((v) => (
                <s-option key={v.id} value={`${v.id}|${v.sku ?? ""}|${v.displayName}`}>
                  {v.displayName} {v.sku ? `(${v.sku})` : ""}
                </s-option>
              ))}
            </s-select>
            <s-grid gridTemplateColumns="1fr 1fr 1fr" gap="base">
              <s-text-field label="Código de lote" name="codigoLote" placeholder="L26-W01" required />
              <s-date-field label="Fecha de caducidad" name="caducidad" required />
              <s-number-field label="Unidades" name="unidades" min={0} value="0" required />
            </s-grid>
            <s-button type="submit" variant="primary" {...(enviando ? { loading: true } : {})}>
              Guardar lote
            </s-button>
          </s-stack>
        </Form>
      </s-section>

      <s-section heading={`Todos los lotes (${lotes.length})`}>
        {lotes.length === 0 ? (
          <s-paragraph>Aún no hay lotes registrados.</s-paragraph>
        ) : (
          <s-table>
            <s-table-header-row>
              <s-table-header>Producto</s-table-header>
              <s-table-header>SKU</s-table-header>
              <s-table-header>Lote</s-table-header>
              <s-table-header format="numeric">Unidades</s-table-header>
              <s-table-header>Caducidad</s-table-header>
              <s-table-header>Acciones</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {lotes.map((l) => (
                <s-table-row key={l.id}>
                  <s-table-cell>{l.productName}</s-table-cell>
                  <s-table-cell>{l.sku}</s-table-cell>
                  <s-table-cell>{l.codigoLote}</s-table-cell>
                  <s-table-cell>{l.unidades}</s-table-cell>
                  <s-table-cell>
                    {new Date(l.caducidad).toLocaleDateString("es-ES")}{" "}
                    <s-badge
                      tone={l.dias <= 0 ? "critical" : l.dias <= 60 ? "warning" : "success"}
                    >
                      {l.dias <= 0 ? "Caducado" : `${l.dias} d`}
                    </s-badge>
                  </s-table-cell>
                  <s-table-cell>
                    <Form method="post">
                      <input type="hidden" name="intent" value="borrar" />
                      <input type="hidden" name="id" value={l.id} />
                      <s-button type="submit" variant="tertiary" tone="critical">
                        Eliminar
                      </s-button>
                    </Form>
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        )}
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
