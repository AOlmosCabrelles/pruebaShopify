import { describe, expect, test } from "vitest";
import { cartLinesDiscountsGenerateRun } from "../src/cart_lines_discounts_generate_run";

const linea = (id, productType) => ({
  id: `gid://shopify/CartLine/${id}`,
  quantity: 1,
  merchandise: { __typename: "ProductVariant", product: { productType } },
});

const input = (lines, extra = {}) => ({
  cart: { lines },
  discount: { discountClasses: ["PRODUCT"], metafield: null, ...extra },
});

describe("Pack proteína + creatina", () => {
  test("no hace nada con el carrito vacío", () => {
    expect(cartLinesDiscountsGenerateRun(input([]))).toEqual({ operations: [] });
  });

  test("no aplica si solo hay proteína", () => {
    const r = cartLinesDiscountsGenerateRun(input([linea(1, "Proteína"), linea(2, "Snack")]));
    expect(r.operations).toHaveLength(0);
  });

  test("aplica 10 % a proteína y creatina, no al resto", () => {
    const r = cartLinesDiscountsGenerateRun(
      input([linea(1, "Proteína"), linea(2, "Creatina"), linea(3, "Vitaminas")]),
    );
    const candidato = r.operations[0].productDiscountsAdd.candidates[0];
    expect(candidato.value.percentage.value).toBe(10);
    expect(candidato.targets.map((t) => t.cartLine.id)).toEqual([
      "gid://shopify/CartLine/1",
      "gid://shopify/CartLine/2",
    ]);
  });

  test("usa el porcentaje configurado en la app", () => {
    const r = cartLinesDiscountsGenerateRun(
      input([linea(1, "Proteína"), linea(2, "Creatina")], {
        metafield: { jsonValue: { porcentaje: 15 } },
      }),
    );
    expect(r.operations[0].productDiscountsAdd.candidates[0].value.percentage.value).toBe(15);
  });

  test("respeta las clases de descuento", () => {
    const r = cartLinesDiscountsGenerateRun(
      input([linea(1, "Proteína"), linea(2, "Creatina")], { discountClasses: ["ORDER"] }),
    );
    expect(r.operations).toHaveLength(0);
  });
});
