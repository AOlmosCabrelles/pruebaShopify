import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

/**
 * Webhook obligatorio de privacidad (RGPD).
 * Shopify lo envía 48 h después de desinstalar la app: borramos todos los
 * datos que guardamos de la tienda.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Recibido ${topic} para ${shop}: borrando datos de la tienda`);

  await db.$transaction([
    db.lote.deleteMany({ where: { shop } }),
    db.ajustes.deleteMany({ where: { shop } }),
    db.session.deleteMany({ where: { shop } }),
  ]);

  return new Response();
};
