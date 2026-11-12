import type { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import {
  CATALOGO,
  COLECCIONES,
  METAFIELD_DEFINITIONS,
} from "../data/catalogo.server";

type Admin = AdminApiContext;

const slug = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type ResultadoCarga = {
  metafields: number;
  productos: string[];
  colecciones: string[];
  lotes: number;
  errores: string[];
};

/** Crea metafields, productos (con stock), colecciones y lotes de prueba. */
export async function cargarCatalogo(
  admin: Admin,
  shop: string,
): Promise<ResultadoCarga> {
  const resultado: ResultadoCarga = {
    metafields: 0,
    productos: [],
    colecciones: [],
    lotes: 0,
    errores: [],
  };

  // 1. Definiciones de metafields (si ya existen, Shopify devuelve TAKEN y seguimos)
  for (const def of METAFIELD_DEFINITIONS) {
    const res = await admin.graphql(
      `#graphql
      mutation vigorCrearMetafieldDef($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition { id }
          userErrors { code message }
        }
      }`,
      { variables: { definition: { ...def, pin: true } } },
    );
    const { data } = await res.json();
    const errs = data?.metafieldDefinitionCreate?.userErrors ?? [];
    if (data?.metafieldDefinitionCreate?.createdDefinition) resultado.metafields++;
    for (const e of errs) {
      if (e.code !== "TAKEN") resultado.errores.push(`Metafield ${def.key}: ${e.message}`);
    }
  }

  // 2. Ubicación principal (para el stock) y canales de venta (para publicar)
  const ctxRes = await admin.graphql(
    `#graphql
    query vigorContexto {
      locations(first: 1) { nodes { id name } }
      publications(first: 20) { nodes { id } }
    }`,
  );
  const { data: ctx } = await ctxRes.json();
  const locationId = ctx?.locations.nodes[0]?.id;
  const publicaciones = (ctx?.publications.nodes ?? []).map((p) => ({
    publicationId: p.id,
  }));
  if (!locationId) {
    resultado.errores.push("La tienda no tiene ninguna ubicación de inventario.");
    return resultado;
  }

  // 3. Colecciones manuales
  const coleccionIds: Record<string, string> = {};
  for (const titulo of COLECCIONES) {
    const handle = slug(titulo);
    const existe = await admin.graphql(
      `#graphql
      query vigorColeccion($handle: String!) {
        collectionByIdentifier(identifier: { handle: $handle }) { id }
      }`,
      { variables: { handle } },
    );
    const { data: d1 } = await existe.json();
    let id = d1?.collectionByIdentifier?.id;
    if (!id) {
      const res = await admin.graphql(
        `#graphql
        mutation vigorCrearColeccion($collection: CollectionCreateInput!) {
          collectionCreate(collection: $collection) {
            collection { id }
            userErrors { message }
          }
        }`,
        { variables: { collection: { title: titulo, handle } } },
      );
      const { data: d2 } = await res.json();
      id = d2?.collectionCreate?.collection?.id;
      d2?.collectionCreate?.userErrors.forEach((e) =>
        resultado.errores.push(`Colección ${titulo}: ${e.message}`),
      );
      if (id) resultado.colecciones.push(titulo);
    }
    if (id) {
      coleccionIds[titulo] = id;
      await publicar(admin, id, publicaciones);
    }
  }

  // 4. Productos (productSet es idempotente usando el handle como identificador)
  for (const p of CATALOGO) {
    const input = {
      title: p.titulo,
      handle: p.handle,
      descriptionHtml: `<p>${p.descripcion}</p>`,
      productType: p.tipo,
      vendor: "Vigor Sport Nutrition",
      status: "ACTIVE" as const,
      tags: [slug(p.coleccion), slug(p.tipo)],
      productOptions: p.opciones.map((o) => ({
        name: o.nombre,
        values: o.valores.map((v) => ({ name: v })),
      })),
      metafields: [
        {
          namespace: "nutricion",
          key: "proteina_por_dosis",
          type: "number_integer",
          value: String(p.nutricion.proteinaPorDosis),
        },
        {
          namespace: "nutricion",
          key: "dosis_g",
          type: "number_integer",
          value: String(p.nutricion.dosisG),
        },
        {
          namespace: "nutricion",
          key: "modo_empleo",
          type: "multi_line_text_field",
          value: p.nutricion.modoEmpleo,
        },
        ...(p.nutricion.alergenos.length
          ? [
              {
                namespace: "nutricion",
                key: "alergenos",
                type: "list.single_line_text_field",
                value: JSON.stringify(p.nutricion.alergenos),
              },
            ]
          : []),
      ],
      variants: p.variantes.map((v) => ({
        optionValues: Object.entries(v.opciones).map(([optionName, name]) => ({
          optionName,
          name,
        })),
        price: v.precio,
        inventoryItem: { sku: v.sku, tracked: true },
        inventoryQuantities: [
          { locationId, name: "available", quantity: v.stock },
        ],
        metafields: [
          {
            namespace: "nutricion",
            key: "gramos_envase",
            type: "number_integer",
            value: String(v.gramosEnvase),
          },
        ],
      })),
    };

    const res = await admin.graphql(
      `#graphql
      mutation vigorProductSet($identifier: ProductSetIdentifiers, $input: ProductSetInput!) {
        productSet(identifier: $identifier, input: $input, synchronous: true) {
          product {
            id
            title
            variants(first: 20) { nodes { id sku displayName } }
          }
          userErrors { field message }
        }
      }`,
      { variables: { identifier: { handle: p.handle }, input } },
    );
    const { data } = await res.json();
    const producto = data?.productSet?.product;
    data?.productSet?.userErrors.forEach((e) =>
      resultado.errores.push(`${p.titulo}: ${e.message}`),
    );
    if (!producto) continue;
    resultado.productos.push(producto.title);

    await publicar(admin, producto.id, publicaciones);
    const coleccionId = coleccionIds[p.coleccion];
    if (coleccionId) {
      await admin.graphql(
        `#graphql
        mutation vigorAddToColeccion($id: ID!, $productIds: [ID!]!) {
          collectionAddProducts(id: $id, productIds: $productIds) {
            userErrors { message }
          }
        }`,
        { variables: { id: coleccionId, productIds: [producto.id] } },
      );
    }

    // 5. Lotes iniciales en nuestra base de datos
    for (const v of p.variantes) {
      const variante = producto.variants.nodes.find((n) => n.sku === v.sku);
      if (!variante) continue;
      const caducidad = new Date();
      caducidad.setDate(caducidad.getDate() + v.lote.caducaEnDias);
      await db.lote.upsert({
        where: {
          shop_variantId_codigoLote: {
            shop,
            variantId: variante.id,
            codigoLote: v.lote.codigo,
          },
        },
        update: { caducidad, unidades: v.stock },
        create: {
          shop,
          variantId: variante.id,
          productName: variante.displayName,
          sku: v.sku,
          codigoLote: v.lote.codigo,
          caducidad,
          unidades: v.stock,
        },
      });
      resultado.lotes++;
    }
  }

  return resultado;
}

async function publicar(
  admin: Admin,
  id: string,
  publicaciones: { publicationId: string }[],
) {
  if (!publicaciones.length) return;
  await admin.graphql(
    `#graphql
    mutation vigorPublicar($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors { message }
      }
    }`,
    { variables: { id, input: publicaciones } },
  );
}
