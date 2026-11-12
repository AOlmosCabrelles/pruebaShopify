/**
 * Catálogo de prueba de "Vigor Sport Nutrition" (tienda ficticia).
 *
 * Se carga en la tienda de desarrollo desde la pantalla "Catálogo de prueba"
 * de la app (ruta /app/catalogo). Es idempotente: si lo ejecutas dos veces,
 * actualiza los productos en lugar de duplicarlos (se identifican por handle).
 */

export type VarianteSeed = {
  opciones: Record<string, string>; // { Sabor: "Chocolate", Tamaño: "1 kg" }
  sku: string;
  precio: string;
  stock: number;
  gramosEnvase: number; // metafield de variante nutricion.gramos_envase
  // Lote inicial (para la pantalla de caducidades)
  lote: { codigo: string; caducaEnDias: number };
};

export type ProductoSeed = {
  handle: string;
  titulo: string;
  tipo: "Proteína" | "Creatina" | "Pre-entreno" | "Aminoácidos" | "Vitaminas" | "Snack";
  coleccion: string;
  descripcion: string;
  opciones: { nombre: string; valores: string[] }[];
  nutricion: {
    proteinaPorDosis: number; // g de proteína por dosis (0 si no aplica)
    dosisG: number; // g por dosis
    alergenos: string[];
    modoEmpleo: string;
  };
  variantes: VarianteSeed[];
};

/** Definiciones de metafields que necesita la tienda. */
export const METAFIELD_DEFINITIONS = [
  {
    ownerType: "PRODUCT",
    namespace: "nutricion",
    key: "proteina_por_dosis",
    name: "Proteína por dosis (g)",
    type: "number_integer",
  },
  {
    ownerType: "PRODUCT",
    namespace: "nutricion",
    key: "dosis_g",
    name: "Tamaño de la dosis (g)",
    type: "number_integer",
  },
  {
    ownerType: "PRODUCT",
    namespace: "nutricion",
    key: "alergenos",
    name: "Alérgenos",
    type: "list.single_line_text_field",
  },
  {
    ownerType: "PRODUCT",
    namespace: "nutricion",
    key: "modo_empleo",
    name: "Modo de empleo",
    type: "multi_line_text_field",
  },
  {
    ownerType: "PRODUCTVARIANT",
    namespace: "nutricion",
    key: "gramos_envase",
    name: "Contenido del envase (g)",
    type: "number_integer",
  },
] as const;

const SABORES_WHEY = ["Chocolate", "Vainilla", "Fresa"];

export const CATALOGO: ProductoSeed[] = [
  {
    handle: "whey-protein-isolate",
    titulo: "Whey Protein Isolate",
    tipo: "Proteína",
    coleccion: "Proteínas",
    descripcion:
      "Proteína de suero aislada (CFM) con 27 g de proteína por dosis. Baja en grasas y azúcares. Ideal para después del entrenamiento.",
    opciones: [
      { nombre: "Sabor", valores: SABORES_WHEY },
      { nombre: "Tamaño", valores: ["1 kg", "2 kg"] },
    ],
    nutricion: {
      proteinaPorDosis: 27,
      dosisG: 30,
      alergenos: ["Leche", "Soja"],
      modoEmpleo:
        "Mezclar 1 dosis (30 g) con 250 ml de agua o leche. Tomar después del entrenamiento.",
    },
    variantes: SABORES_WHEY.flatMap((sabor, i) => [
      {
        opciones: { Sabor: sabor, Tamaño: "1 kg" },
        sku: `WHEY-${sabor.slice(0, 3).toUpperCase()}-1`,
        precio: "34.90",
        stock: [42, 8, 25][i],
        gramosEnvase: 1000,
        lote: { codigo: `L26-W${i}1`, caducaEnDias: [400, 45, 200][i] },
      },
      {
        opciones: { Sabor: sabor, Tamaño: "2 kg" },
        sku: `WHEY-${sabor.slice(0, 3).toUpperCase()}-2`,
        precio: "59.90",
        stock: [18, 3, 12][i],
        gramosEnvase: 2000,
        lote: { codigo: `L26-W${i}2`, caducaEnDias: [380, 300, 20][i] },
      },
    ]),
  },
  {
    handle: "creatina-monohidrato",
    titulo: "Creatina Monohidrato",
    tipo: "Creatina",
    coleccion: "Rendimiento",
    descripcion:
      "Creatina monohidrato micronizada 100 % pura. La creatina aumenta el rendimiento físico en series sucesivas de ejercicios breves de alta intensidad (con una ingesta diaria de 3 g).",
    opciones: [{ nombre: "Tamaño", valores: ["300 g", "500 g"] }],
    nutricion: {
      proteinaPorDosis: 0,
      dosisG: 3,
      alergenos: [],
      modoEmpleo: "Tomar 3 g al día disueltos en agua.",
    },
    variantes: [
      {
        opciones: { Tamaño: "300 g" },
        sku: "CREA-300",
        precio: "19.90",
        stock: 60,
        gramosEnvase: 300,
        lote: { codigo: "L26-C01", caducaEnDias: 500 },
      },
      {
        opciones: { Tamaño: "500 g" },
        sku: "CREA-500",
        precio: "27.90",
        stock: 6,
        gramosEnvase: 500,
        lote: { codigo: "L26-C02", caducaEnDias: 35 },
      },
    ],
  },
  {
    handle: "pre-entreno-explosive",
    titulo: "Pre-Entreno Explosive",
    tipo: "Pre-entreno",
    coleccion: "Rendimiento",
    descripcion:
      "Fórmula pre-entrenamiento con cafeína, beta-alanina y citrulina. Contiene cafeína (200 mg por dosis): no recomendado para niños ni mujeres embarazadas.",
    opciones: [{ nombre: "Sabor", valores: ["Limón", "Frutos rojos"] }],
    nutricion: {
      proteinaPorDosis: 0,
      dosisG: 10,
      alergenos: [],
      modoEmpleo: "1 dosis (10 g) en 300 ml de agua 20-30 minutos antes de entrenar.",
    },
    variantes: [
      {
        opciones: { Sabor: "Limón" },
        sku: "PRE-LIM",
        precio: "29.90",
        stock: 30,
        gramosEnvase: 300,
        lote: { codigo: "L26-P01", caducaEnDias: 250 },
      },
      {
        opciones: { Sabor: "Frutos rojos" },
        sku: "PRE-FRU",
        precio: "29.90",
        stock: 2,
        gramosEnvase: 300,
        lote: { codigo: "L26-P02", caducaEnDias: 90 },
      },
    ],
  },
  {
    handle: "bcaa-2-1-1",
    titulo: "BCAA 2:1:1",
    tipo: "Aminoácidos",
    coleccion: "Recuperación",
    descripcion: "Aminoácidos ramificados (leucina, isoleucina y valina) en proporción 2:1:1.",
    opciones: [{ nombre: "Sabor", valores: ["Mango", "Neutro"] }],
    nutricion: {
      proteinaPorDosis: 0,
      dosisG: 10,
      alergenos: [],
      modoEmpleo: "1 dosis (10 g) durante o después del entrenamiento.",
    },
    variantes: [
      {
        opciones: { Sabor: "Mango" },
        sku: "BCAA-MAN",
        precio: "22.90",
        stock: 22,
        gramosEnvase: 400,
        lote: { codigo: "L26-B01", caducaEnDias: 15 },
      },
      {
        opciones: { Sabor: "Neutro" },
        sku: "BCAA-NEU",
        precio: "22.90",
        stock: 14,
        gramosEnvase: 400,
        lote: { codigo: "L26-B02", caducaEnDias: 420 },
      },
    ],
  },
  {
    handle: "multivitaminico-sport",
    titulo: "Multivitamínico Sport",
    tipo: "Vitaminas",
    coleccion: "Salud",
    descripcion:
      "Complejo de vitaminas y minerales. La vitamina C contribuye al funcionamiento normal del sistema inmunitario durante y después de un ejercicio físico intenso.",
    opciones: [{ nombre: "Formato", valores: ["90 cápsulas"] }],
    nutricion: {
      proteinaPorDosis: 0,
      dosisG: 1,
      alergenos: [],
      modoEmpleo: "1 cápsula al día con la comida principal.",
    },
    variantes: [
      {
        opciones: { Formato: "90 cápsulas" },
        sku: "MULTI-90",
        precio: "14.90",
        stock: 75,
        gramosEnvase: 90,
        lote: { codigo: "L26-M01", caducaEnDias: 700 },
      },
    ],
  },
  {
    handle: "barritas-proteicas-caja-12",
    titulo: "Barritas proteicas (caja de 12)",
    tipo: "Snack",
    coleccion: "Snacks",
    descripcion: "Barritas con 20 g de proteína y bajo contenido en azúcares. Caja de 12 unidades.",
    opciones: [{ nombre: "Sabor", valores: ["Cookies", "Cacahuete"] }],
    nutricion: {
      proteinaPorDosis: 20,
      dosisG: 55,
      alergenos: ["Leche", "Soja", "Cacahuete", "Gluten"],
      modoEmpleo: "1 barrita como tentempié entre comidas.",
    },
    variantes: [
      {
        opciones: { Sabor: "Cookies" },
        sku: "BAR-COO",
        precio: "24.90",
        stock: 9,
        gramosEnvase: 660,
        lote: { codigo: "L26-BA1", caducaEnDias: 25 },
      },
      {
        opciones: { Sabor: "Cacahuete" },
        sku: "BAR-CAC",
        precio: "24.90",
        stock: 40,
        gramosEnvase: 660,
        lote: { codigo: "L26-BA2", caducaEnDias: 120 },
      },
    ],
  },
];

export const COLECCIONES = Array.from(new Set(CATALOGO.map((p) => p.coleccion)));
