import type { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";

export async function obtenerAjustes(shop: string) {
  return (
    (await db.ajustes.findUnique({ where: { shop } })) ?? {
      shop,
      umbralStock: 10,
      diasCaducidad: 60,
    }
  );
}

export type VarianteStock = {
  id: string;
  sku: string | null;
  nombre: string;
  stock: number;
};

/** Variantes con stock por debajo del umbral (consulta a la Admin API). */
export async function variantesConStockBajo(
  admin: AdminApiContext,
  umbral: number,
): Promise<VarianteStock[]> {
  const res = await admin.graphql(
    `#graphql
    query vigorStockBajo($query: String!) {
      productVariants(first: 100, query: $query, sortKey: INVENTORY_QUANTITY) {
        nodes {
          id
          sku
          displayName
          inventoryQuantity
        }
      }
    }`,
    { variables: { query: `inventory_quantity:<${umbral} AND product_status:active` } },
  );
  const { data } = await res.json();
  return (data?.productVariants.nodes ?? []).map((v) => ({
    id: v.id,
    sku: v.sku ?? null,
    nombre: v.displayName,
    stock: v.inventoryQuantity ?? 0,
  }));
}

/** Variantes del catálogo, para el desplegable del alta de lotes. */
export async function listarVariantes(admin: AdminApiContext) {
  const res = await admin.graphql(
    `#graphql
    query vigorVariantes {
      productVariants(first: 250, sortKey: TITLE) {
        nodes { id sku displayName }
      }
    }`,
  );
  const { data } = await res.json();
  return data?.productVariants.nodes ?? [];
}

/** Días que faltan hasta una fecha (negativo = ya caducado). */
export function diasHasta(fecha: Date | string) {
  const ms = new Date(fecha).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}
