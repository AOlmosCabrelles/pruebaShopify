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
import db from "../db.server";
import { obtenerAjustes } from "../services/inventario.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return obtenerAjustes(session.shop);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const umbralStock = Math.max(0, Number(form.get("umbralStock")) || 0);
  const diasCaducidad = Math.max(1, Number(form.get("diasCaducidad")) || 60);
  await db.ajustes.upsert({
    where: { shop: session.shop },
    update: { umbralStock, diasCaducidad },
    create: { shop: session.shop, umbralStock, diasCaducidad },
  });
  return { guardado: Date.now() };
};

export default function Ajustes() {
  const ajustes = useLoaderData<typeof loader>();
  const resultado = useActionData<typeof action>();
  const shopify = useAppBridge();

  useEffect(() => {
    if (resultado?.guardado) shopify.toast.show("Ajustes guardados");
  }, [resultado?.guardado, shopify]);

  return (
    <s-page heading="Ajustes">
      <Form method="post">
        <s-section heading="Avisos del panel">
          <s-stack gap="base">
            <s-number-field
              label="Umbral de stock bajo (unidades)"
              name="umbralStock"
              min={0}
              value={String(ajustes.umbralStock)}
              details="Se avisará de las variantes con menos unidades que este valor."
            />
            <s-number-field
              label="Aviso de caducidad (días)"
              name="diasCaducidad"
              min={1}
              value={String(ajustes.diasCaducidad)}
              details="Se avisará de los lotes que caduquen dentro de este plazo."
            />
            <s-button type="submit" variant="primary">
              Guardar
            </s-button>
          </s-stack>
        </s-section>
      </Form>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
