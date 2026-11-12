// Shopify Function: "Pack proteína + creatina"
//
// Si el carrito contiene al menos un producto de tipo "Proteína" y otro de
// tipo "Creatina", aplica un descuento (10 % por defecto) a esas líneas.
// El porcentaje se puede cambiar desde la app (metafield $app:config).

export const TIPOS_PACK = ["Proteína", "Creatina"];
export const PORCENTAJE_POR_DEFECTO = 10;

/**
 * @typedef {{ id: string, quantity: number, merchandise: { __typename: string, product?: { productType?: string | null } } }} Linea
 * @param {{ cart: { lines: Linea[] }, discount: { discountClasses: string[], metafield?: { jsonValue: any } | null } }} input
 */
export function cartLinesDiscountsGenerateRun(input) {
  const vacio = { operations: [] };

  if (!input.discount.discountClasses.includes("PRODUCT")) return vacio;

  const tipoDe = (linea) =>
    linea.merchandise.__typename === "ProductVariant"
      ? (linea.merchandise.product?.productType ?? "")
      : "";

  const lineasPack = input.cart.lines.filter((l) => TIPOS_PACK.includes(tipoDe(l)));
  const tieneTodos = TIPOS_PACK.every((tipo) =>
    lineasPack.some((l) => tipoDe(l) === tipo),
  );
  if (!tieneTodos) return vacio;

  const config = input.discount.metafield?.jsonValue ?? {};
  const porcentaje = Number(config.porcentaje) > 0 ? Number(config.porcentaje) : PORCENTAJE_POR_DEFECTO;

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: [
            {
              message: `Pack Proteína + Creatina -${porcentaje}%`,
              targets: lineasPack.map((l) => ({ cartLine: { id: l.id } })),
              value: { percentage: { value: porcentaje } },
            },
          ],
          selectionStrategy: "FIRST",
        },
      },
    ],
  };
}
