import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

// Debe coincidir con "handle" en extensions/pack-proteina-creatina/shopify.extension.toml
const FUNCTION_HANDLE = "pack-proteina-creatina";
const TAG = "vigor-pack";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const res = await admin.graphql(
    `#graphql
    query vigorDescuentos {
      discountNodes(first: 50, query: "method:automatic") {
        nodes {
          id
          metafield(namespace: "$app", key: "config") { jsonValue }
          discount {
            __typename
            ... on DiscountAutomaticApp { title status tags startsAt }
          }
        }
      }
    }`,
  );
  const { data } = await res.json();
  const nodo = data?.discountNodes.nodes.find(
    (n) =>
      n.discount.__typename === "DiscountAutomaticApp" &&
      n.discount.tags.includes(TAG),
  );
  if (!nodo || nodo.discount.__typename !== "DiscountAutomaticApp") {
    return { descuento: null };
  }
  const config = (nodo.metafield?.jsonValue ?? {}) as { porcentaje?: number };
  return {
    descuento: {
      id: nodo.id,
      titulo: nodo.discount.title,
      estado: nodo.discount.status,
      porcentaje: config.porcentaje ?? 10,
    },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const form = await request.formData();
  const porcentaje = Math.min(90, Math.max(1, Number(form.get("porcentaje")) || 10));
  const id = String(form.get("id") ?? "");
  const config = JSON.stringify({ porcentaje });

  if (id) {
    const res = await admin.graphql(
      `#graphql
      mutation vigorActualizarConfig($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) { userErrors { message } }
      }`,
      {
        variables: {
          metafields: [
            { ownerId: id, namespace: "$app", key: "config", type: "json", value: config },
          ],
        },
      },
    );
    const { data } = await res.json();
    const errores = data?.metafieldsSet?.userErrors.map((e) => e.message) ?? [];
    return { ok: errores.length === 0, mensaje: errores[0] ?? "Porcentaje actualizado" };
  }

  const res = await admin.graphql(
    `#graphql
    mutation vigorCrearDescuento($discount: DiscountAutomaticAppInput!) {
      discountAutomaticAppCreate(automaticAppDiscount: $discount) {
        automaticAppDiscount { discountId }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        discount: {
          title: "Pack Proteína + Creatina",
          functionHandle: FUNCTION_HANDLE,
          discountClasses: ["PRODUCT"],
          startsAt: new Date().toISOString(),
          tags: [TAG],
          combinesWith: { orderDiscounts: true, shippingDiscounts: true },
          metafields: [
            { namespace: "$app", key: "config", type: "json", value: config },
          ],
        },
      },
    },
  );
  const { data } = await res.json();
  const errores =
    data?.discountAutomaticAppCreate?.userErrors.map((e) => e.message) ?? [];
  return {
    ok: errores.length === 0,
    mensaje: errores[0] ?? "Descuento automático activado",
  };
};

export default function Promociones() {
  const { descuento } = useLoaderData<typeof loader>();
  const resultado = useActionData<typeof action>();
  const shopify = useAppBridge();

  useEffect(() => {
    if (resultado) shopify.toast.show(resultado.mensaje, { isError: !resultado.ok });
  }, [resultado, shopify]);

  return (
    <s-page heading="Pack proteína + creatina">
      <s-section heading="Cómo funciona">
        <s-paragraph>
          Cuando un cliente añade al carrito un producto de tipo{" "}
          <s-text type="strong">Proteína</s-text> y otro de tipo{" "}
          <s-text type="strong">Creatina</s-text>, la Shopify Function{" "}
          <s-text type="strong">pack-proteina-creatina</s-text> aplica
          automáticamente el descuento a esas líneas.
        </s-paragraph>
      </s-section>

      <s-section heading="Configuración">
        {descuento ? (
          <s-banner tone="success" heading={`${descuento.titulo}: ${descuento.estado}`}>
            <s-paragraph>El descuento ya está creado en la tienda.</s-paragraph>
          </s-banner>
        ) : (
          <s-banner tone="info" heading="El descuento aún no está activo">
            <s-paragraph>
              Requiere que la extensión esté desplegada (con `shopify app dev`
              se despliega automáticamente en la tienda de desarrollo).
            </s-paragraph>
          </s-banner>
        )}
        <Form method="post">
          <input type="hidden" name="id" value={descuento?.id ?? ""} />
          <s-stack gap="base">
            <s-number-field
              label="Porcentaje de descuento"
              name="porcentaje"
              min={1}
              max={90}
              suffix="%"
              value={String(descuento?.porcentaje ?? 10)}
            />
            <s-button type="submit" variant="primary">
              {descuento ? "Guardar porcentaje" : "Activar descuento"}
            </s-button>
          </s-stack>
        </Form>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
