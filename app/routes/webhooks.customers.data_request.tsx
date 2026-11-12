import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

/**
 * Webhook obligatorio de privacidad (RGPD).
 * Vigor Manager no guarda datos personales de clientes (solo lotes y ajustes
 * de la tienda), así que basta con confirmar la recepción.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Recibido ${topic} para ${shop}: no hay datos de clientes que procesar`);
  return new Response();
};
