// ============================================================================
// Catálogo de ejemplo de Vigor Sport Nutrition (marca ficticia).
// Única fuente de datos: de aquí salen el CSV (generar-csv.mjs) y las
// imágenes de producto (imagenes/generar-imagenes.mjs).
//
// Para añadir un producto: copia uno parecido, cambia los datos y ejecuta
//   node tienda/scripts/generar-csv.mjs
//   node tienda/scripts/generar-imagenes.mjs tienda/imagenes
// ============================================================================

const AVISO_COMPLEMENTOS =
  "Los complementos alimenticios no deben utilizarse como sustituto de una dieta equilibrada y variada ni de un estilo de vida saludable. No superar la dosis diaria recomendada. Mantener fuera del alcance de los niños.";

/** Combina las opciones en variantes: [["Chocolate","1 kg"], ["Chocolate","2 kg"], ...] */
export const combinar = (opciones) =>
  opciones.reduce((acc, o) => acc.flatMap((a) => o.valores.map((v) => [...a, v])), [[]]);

export const PRODUCTOS = [
  // ───────────────────────────── PROTEÍNAS ─────────────────────────────
  {
    handle: "whey-protein-isolate",
    ambiente: "batido", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-batido.jpg
    titulo: "Whey Protein Isolate",
    tipo: "Proteínas",
    tags: "proteina, recuperacion, whey",
    seo: "Whey Protein Isolate 27 g de proteína por dosis",
    descripcion: "Proteína de suero aislada (CFM) con 27 g de proteína por dosis. Baja en grasas y azúcares, ideal después de entrenar.",
    tabla: [["Por dosis (30 g)", ""], ["Energía", "113 kcal"], ["Proteínas", "27 g"], ["Hidratos de carbono", "0,9 g"], ["de los cuales azúcares", "0,6 g"], ["Grasas", "0,3 g"], ["Sal", "0,1 g"]],
    alergenos: "<strong>leche</strong>. Puede contener trazas de <strong>soja</strong>.",
    modo: "Mezclar 1 dosis (30 g) con 250 ml de agua o leche después del entrenamiento.",
    opciones: [{ nombre: "Sabor", valores: ["Chocolate", "Vainilla", "Fresa"] }, { nombre: "Tamaño", valores: ["1 kg", "2 kg"] }],
    variante: ([sabor, tam]) => ({
      sku: `WHEY-${sabor.slice(0, 3).toUpperCase()}-${tam[0]}`,
      gramos: tam === "1 kg" ? 1000 : 2000,
      precio: tam === "1 kg" ? "34.90" : "59.90",
      stock: { Chocolate: [42, 18], Vainilla: [8, 3], Fresa: [25, 12] }[sabor][tam === "1 kg" ? 0 : 1],
    }),
    imagen: ([sabor, tam]) => ({
      forma: "tarro",
      ...{ Chocolate: { color: "#5B3A29", color2: "#3d2619" }, Vainilla: { color: "#E9D8A6", color2: "#cdb87f", claro: true }, Fresa: { color: "#E86A92", color2: "#c94a74" } }[sabor],
      nombre: ["WHEY PROTEIN", "ISOLATE"], sabor, peso: tam, dato: "27 g de proteína por dosis", escala: tam === "1 kg" ? 0.84 : 1,
    }),
  },
  {
    handle: "whey-protein-concentrada",
    ambiente: "batido", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-batido.jpg
    titulo: "Whey Protein Concentrada",
    tipo: "Proteínas",
    tags: "proteina, recuperacion, whey",
    seo: "Whey Protein Concentrada 22 g de proteína por dosis",
    descripcion: "Proteína de suero concentrada con 22 g de proteína por dosis. La opción más versátil y con mejor relación calidad-precio para tu día a día.",
    tabla: [["Por dosis (30 g)", ""], ["Energía", "118 kcal"], ["Proteínas", "22 g"], ["Hidratos de carbono", "3 g"], ["de los cuales azúcares", "2,4 g"], ["Grasas", "1,9 g"], ["Sal", "0,15 g"]],
    alergenos: "<strong>leche</strong>. Puede contener trazas de <strong>soja</strong> y <strong>gluten</strong>.",
    modo: "Mezclar 1 dosis (30 g) con 250 ml de agua o leche, después de entrenar o entre comidas.",
    opciones: [{ nombre: "Sabor", valores: ["Chocolate", "Vainilla", "Cookies"] }, { nombre: "Tamaño", valores: ["1 kg", "2 kg"] }],
    variante: ([sabor, tam]) => ({
      sku: `WPC-${sabor.slice(0, 3).toUpperCase()}-${tam[0]}`,
      gramos: tam === "1 kg" ? 1000 : 2000,
      precio: tam === "1 kg" ? "24.90" : "44.90",
      stock: { Chocolate: [55, 30], Vainilla: [34, 16], Cookies: [21, 4] }[sabor][tam === "1 kg" ? 0 : 1],
    }),
    imagen: ([sabor, tam]) => ({
      forma: "tarro", tapa: "#E4572E",
      ...{ Chocolate: { color: "#6B4226", color2: "#4a2c18" }, Vainilla: { color: "#F0E2B6", color2: "#d4c08a", claro: true }, Cookies: { color: "#3B3B3B", color2: "#222222" } }[sabor],
      nombre: ["WHEY PROTEIN", "CONCENTRADA"], sabor, peso: tam, dato: "22 g de proteína por dosis", escala: tam === "1 kg" ? 0.84 : 1,
    }),
  },
  {
    handle: "proteina-vegana",
    ambiente: "batido", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-batido.jpg
    titulo: "Proteína Vegana",
    tipo: "Proteínas",
    tags: "proteina, vegana, guisante",
    seo: "Proteína Vegana de guisante y arroz, 21 g por dosis",
    descripcion: "Mezcla de proteína de guisante y arroz con 21 g de proteína vegetal por dosis. Apta para veganos y sin lactosa.",
    tabla: [["Por dosis (30 g)", ""], ["Energía", "116 kcal"], ["Proteínas", "21 g"], ["Hidratos de carbono", "2,1 g"], ["de los cuales azúcares", "0,5 g"], ["Grasas", "2,2 g"], ["Sal", "0,6 g"]],
    alergenos: "no contiene alérgenos de declaración obligatoria. Elaborado en instalaciones que procesan <strong>soja</strong>.",
    modo: "Mezclar 1 dosis (30 g) con 300 ml de agua o bebida vegetal.",
    opciones: [{ nombre: "Sabor", valores: ["Chocolate", "Neutro"] }],
    variante: ([sabor]) => ({ sku: `VEG-${sabor.slice(0, 3).toUpperCase()}`, gramos: 750, precio: "29.90", stock: sabor === "Chocolate" ? 26 : 11 }),
    imagen: ([sabor]) => ({
      forma: "tarro", tapa: "#2F5D2A",
      ...(sabor === "Chocolate" ? { color: "#5E4B3C", color2: "#3f3128" } : { color: "#7A9A65", color2: "#5a7a47" }),
      nombre: ["PROTEÍNA", "VEGANA"], sabor, peso: "750 g", dato: "21 g de proteína vegetal", escala: 0.9,
    }),
  },
  {
    handle: "caseina-micelar",
    ambiente: "batido", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-batido.jpg
    titulo: "Caseína Micelar",
    tipo: "Proteínas",
    tags: "proteina, caseina, noche",
    seo: "Caseína Micelar de liberación lenta, 24 g por dosis",
    descripcion: "Caseína micelar de digestión lenta con 24 g de proteína por dosis. Ideal antes de dormir o en periodos largos sin comer.",
    tabla: [["Por dosis (30 g)", ""], ["Energía", "110 kcal"], ["Proteínas", "24 g"], ["Hidratos de carbono", "1,5 g"], ["de los cuales azúcares", "0,4 g"], ["Grasas", "0,5 g"], ["Sal", "0,1 g"]],
    alergenos: "<strong>leche</strong>.",
    modo: "Mezclar 1 dosis (30 g) con 300 ml de agua o leche, preferiblemente antes de dormir.",
    opciones: [{ nombre: "Sabor", valores: ["Chocolate", "Vainilla"] }],
    variante: ([sabor]) => ({ sku: `CAS-${sabor.slice(0, 3).toUpperCase()}`, gramos: 1000, precio: "32.90", stock: sabor === "Chocolate" ? 19 : 7 }),
    imagen: ([sabor]) => ({
      forma: "tarro", tapa: "#1F2A44",
      ...(sabor === "Chocolate" ? { color: "#3E2A20", color2: "#2a1c15" } : { color: "#E8DDC0", color2: "#cdbf98", claro: true }),
      nombre: ["CASEÍNA", "MICELAR"], sabor, peso: "1 kg", dato: "24 g de proteína por dosis", escala: 0.9,
    }),
  },

  // ───────────────────────────── RENDIMIENTO ─────────────────────────────
  {
    handle: "creatina-monohidrato",
    ambiente: "creatina", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-creatina.jpg
    titulo: "Creatina Monohidrato",
    tipo: "Rendimiento",
    tags: "creatina, rendimiento, fuerza",
    seo: "Creatina Monohidrato micronizada 100 % pura",
    descripcion: "Creatina monohidrato micronizada 100 % pura. La creatina aumenta el rendimiento físico en series sucesivas de ejercicios breves de alta intensidad. El efecto beneficioso se obtiene con una ingesta diaria de 3 g.",
    tabla: [["Por dosis (3 g)", ""], ["Creatina monohidrato", "3 g"]],
    alergenos: "no contiene.",
    modo: "Tomar 3 g al día disueltos en agua o zumo.",
    opciones: [{ nombre: "Tamaño", valores: ["300 g", "500 g"] }],
    variante: ([tam]) => ({ sku: `CREA-${tam.split(" ")[0]}`, gramos: parseInt(tam), precio: tam === "300 g" ? "19.90" : "27.90", stock: tam === "300 g" ? 60 : 6 }),
    imagen: ([tam]) => ({ forma: "tarro", color: "#2D6CDF", color2: "#1d4fa8", tapa: "#2D6CDF", nombre: ["CREATINA", "MONOHIDRATO"], sabor: "100 % pura", peso: tam, dato: "3 g por dosis · micronizada", escala: tam === "300 g" ? 0.72 : 0.84 }),
  },
  {
    handle: "pre-entreno-explosive",
    titulo: "Pre-Entreno Explosive",
    tipo: "Rendimiento",
    tags: "pre-entreno, cafeina, energia",
    seo: "Pre-Entreno Explosive con cafeína y citrulina",
    descripcion: "Fórmula pre-entrenamiento con cafeína, beta-alanina y citrulina.",
    tabla: [["Por dosis (10 g)", ""], ["Citrulina malato", "4 g"], ["Beta-alanina", "3,2 g"], ["Cafeína", "200 mg"]],
    alergenos: "no contiene.",
    modo: "1 dosis (10 g) en 300 ml de agua 20-30 minutos antes de entrenar. No tomar más de 1 dosis al día.",
    aviso: "Contenido elevado de cafeína (200 mg por dosis). No recomendado para niños ni mujeres embarazadas o en periodo de lactancia.",
    opciones: [{ nombre: "Sabor", valores: ["Limón", "Frutos rojos"] }],
    variante: ([sabor]) => ({ sku: "PRE-" + sabor.slice(0, 3).toUpperCase(), gramos: 300, precio: "29.90", stock: sabor === "Limón" ? 30 : 2 }),
    imagen: ([sabor]) => ({
      forma: "tarro", tapa: "#E4572E",
      ...(sabor === "Limón" ? { color: "#F2D649", color2: "#d6b923", claro: true } : { color: "#8E2C6E", color2: "#651c4e" }),
      nombre: ["PRE-ENTRENO", "EXPLOSIVE"], sabor, peso: "300 g", dato: "200 mg cafeína · citrulina", escala: 0.78,
    }),
  },
  {
    handle: "beta-alanina",
    ambiente: "creatina", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-creatina.jpg
    titulo: "Beta-Alanina",
    tipo: "Rendimiento",
    tags: "beta-alanina, rendimiento, resistencia",
    seo: "Beta-Alanina en polvo 3,2 g por dosis",
    descripcion: "Beta-alanina pura en polvo, sin sabor, para añadir a tu batido o a tu pre-entreno.",
    tabla: [["Por dosis (3,2 g)", ""], ["Beta-alanina", "3,2 g"]],
    alergenos: "no contiene.",
    modo: "Tomar 3,2 g al día disueltos en agua. Puede producir un hormigueo pasajero en la piel (parestesia); es normal.",
    opciones: [{ nombre: "Tamaño", valores: ["300 g"] }],
    variante: () => ({ sku: "BALA-300", gramos: 300, precio: "19.90", stock: 24 }),
    imagen: () => ({ forma: "tarro", color: "#D7263D", color2: "#a51b2d", nombre: ["BETA", "ALANINA"], sabor: "Neutro", peso: "300 g", dato: "3,2 g por dosis", escala: 0.72 }),
  },
  {
    handle: "citrulina-malato",
    ambiente: "creatina", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-creatina.jpg
    titulo: "Citrulina Malato",
    tipo: "Rendimiento",
    tags: "citrulina, rendimiento, bombeo",
    seo: "Citrulina Malato 2:1 en polvo",
    descripcion: "L-citrulina malato en proporción 2:1, sin sabor. Uno de los ingredientes más populares en los pre-entrenos.",
    tabla: [["Por dosis (6 g)", ""], ["L-citrulina malato 2:1", "6 g"]],
    alergenos: "no contiene.",
    modo: "Tomar 6 g disueltos en agua 30-60 minutos antes de entrenar.",
    opciones: [{ nombre: "Tamaño", valores: ["300 g"] }],
    variante: () => ({ sku: "CITR-300", gramos: 300, precio: "21.90", stock: 17 }),
    imagen: () => ({ forma: "tarro", color: "#7B2CBF", color2: "#58208a", nombre: ["CITRULINA", "MALATO"], sabor: "Neutro", peso: "300 g", dato: "6 g por dosis · 2:1", escala: 0.72 }),
  },
  {
    handle: "cafeina-200",
    ambiente: "multivitaminico", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-multivitaminico.jpg
    titulo: "Cafeína 200 mg",
    tipo: "Rendimiento",
    tags: "cafeina, energia, capsulas",
    seo: "Cafeína anhidra 200 mg, 90 cápsulas",
    descripcion: "Cafeína anhidra en cápsulas de 200 mg, cómoda y fácil de dosificar.",
    tabla: [["Por cápsula", ""], ["Cafeína anhidra", "200 mg"]],
    alergenos: "no contiene.",
    modo: "1 cápsula con agua 30 minutos antes de entrenar. No tomar más de 2 cápsulas al día ni por la tarde-noche.",
    aviso: "Contenido elevado de cafeína (200 mg por cápsula). No recomendado para niños ni mujeres embarazadas o en periodo de lactancia.",
    opciones: [{ nombre: "Formato", valores: ["90 cápsulas"] }],
    variante: () => ({ sku: "CAF-90", gramos: 80, precio: "9.90", stock: 48 }),
    imagen: () => ({ forma: "bote", color: "#222222", nombre: ["CAFEÍNA", "200 mg"], sabor: "Energía", peso: "90 cápsulas", dato: "Cafeína anhidra" }),
  },
  {
    handle: "bebida-isotonica",
    titulo: "Bebida Isotónica",
    tipo: "Rendimiento",
    tags: "isotonica, hidratacion, electrolitos, resistencia",
    seo: "Bebida isotónica en polvo con electrolitos",
    descripcion: "Bebida isotónica en polvo con hidratos de carbono y electrolitos. Las soluciones de carbohidratos y electrolitos contribuyen a mantener la resistencia en ejercicios de resistencia prolongados.",
    tabla: [["Por dosis (40 g)", ""], ["Energía", "152 kcal"], ["Hidratos de carbono", "38 g"], ["de los cuales azúcares", "18 g"], ["Sodio", "460 mg"], ["Potasio", "120 mg"]],
    alergenos: "no contiene.",
    modo: "Disolver 40 g en 500 ml de agua y beber durante el ejercicio.",
    opciones: [{ nombre: "Sabor", valores: ["Limón", "Naranja"] }],
    variante: ([sabor]) => ({ sku: "ISO-" + sabor.slice(0, 3).toUpperCase(), gramos: 1000, precio: "17.90", stock: sabor === "Limón" ? 38 : 29 }),
    imagen: ([sabor]) => ({
      forma: "tarro", tapa: "#0B7A75",
      ...(sabor === "Limón" ? { color: "#F2D649", color2: "#d6b923", claro: true } : { color: "#F7931E", color2: "#d97706" }),
      nombre: ["ISOTÓNICA", "SPORT DRINK"], sabor, peso: "1 kg", dato: "Carbohidratos + electrolitos", escala: 0.9,
    }),
  },

  // ───────────────────────────── RECUPERACIÓN ─────────────────────────────
  {
    handle: "bcaa-2-1-1",
    titulo: "BCAA 2:1:1",
    tipo: "Recuperación",
    tags: "aminoacidos, bcaa, recuperacion",
    seo: "BCAA 2:1:1 aminoácidos ramificados",
    descripcion: "Aminoácidos ramificados (leucina, isoleucina y valina) en proporción 2:1:1.",
    tabla: [["Por dosis (10 g)", ""], ["L-leucina", "5 g"], ["L-isoleucina", "2,5 g"], ["L-valina", "2,5 g"]],
    alergenos: "no contiene.",
    modo: "1 dosis (10 g) durante o después del entrenamiento.",
    opciones: [{ nombre: "Sabor", valores: ["Mango", "Neutro"] }],
    variante: ([sabor]) => ({ sku: "BCAA-" + sabor.slice(0, 3).toUpperCase(), gramos: 400, precio: "22.90", stock: sabor === "Mango" ? 22 : 14 }),
    imagen: ([sabor]) => ({
      forma: "tarro",
      ...(sabor === "Mango" ? { color: "#F39237", color2: "#d1731c" } : { color: "#7D8A99", color2: "#5d6977" }),
      nombre: ["BCAA", "2:1:1"], sabor, peso: "400 g", dato: "10 g aminoácidos por dosis", escala: 0.8,
    }),
  },
  {
    handle: "l-glutamina",
    ambiente: "creatina", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-creatina.jpg
    titulo: "L-Glutamina",
    tipo: "Recuperación",
    tags: "glutamina, aminoacidos, recuperacion",
    seo: "L-Glutamina en polvo 5 g por dosis",
    descripcion: "L-glutamina pura en polvo, sin sabor, fácil de mezclar con tu batido de proteínas.",
    tabla: [["Por dosis (5 g)", ""], ["L-glutamina", "5 g"]],
    alergenos: "no contiene.",
    modo: "Tomar 5 g al día disueltos en agua o en tu batido.",
    opciones: [{ nombre: "Tamaño", valores: ["500 g"] }],
    variante: () => ({ sku: "GLUT-500", gramos: 500, precio: "22.90", stock: 20 }),
    imagen: () => ({ forma: "tarro", color: "#00A6A6", color2: "#007f7f", nombre: ["L-GLUTAMINA"], sabor: "Neutro", peso: "500 g", dato: "5 g por dosis", escala: 0.8 }),
  },
  {
    handle: "colageno-magnesio",
    titulo: "Colágeno + Magnesio",
    tipo: "Recuperación",
    tags: "colageno, magnesio, articulaciones",
    seo: "Colágeno hidrolizado con magnesio, sabor limón",
    descripcion: "Colágeno hidrolizado con magnesio. El magnesio contribuye al funcionamiento normal de los músculos.",
    tabla: [["Por dosis (12 g)", ""], ["Colágeno hidrolizado", "10 g"], ["Magnesio", "112 mg (30 % VRN)"]],
    alergenos: "no contiene.",
    modo: "Disolver 1 dosis (12 g) en 200 ml de agua, una vez al día.",
    opciones: [{ nombre: "Sabor", valores: ["Limón"] }],
    variante: () => ({ sku: "COLA-LIM", gramos: 350, precio: "24.90", stock: 15 }),
    imagen: () => ({ forma: "tarro", color: "#E9A0B0", color2: "#cf7f92", claro: true, nombre: ["COLÁGENO", "+ MAGNESIO"], sabor: "Limón", peso: "350 g", dato: "10 g colágeno por dosis", escala: 0.82 }),
  },

  // ───────────────────────────── SALUD ─────────────────────────────
  {
    handle: "multivitaminico-sport",
    ambiente: "multivitaminico", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-multivitaminico.jpg
    titulo: "Multivitamínico Sport",
    tipo: "Salud",
    tags: "vitaminas, minerales, salud",
    seo: "Multivitamínico Sport 90 cápsulas",
    descripcion: "Complejo de vitaminas y minerales para deportistas. La vitamina C contribuye a mantener el funcionamiento normal del sistema inmunitario durante y después de un ejercicio físico intenso.",
    tabla: [["Por cápsula", ""], ["Vitamina C", "200 mg (250 % VRN)"], ["Vitamina D", "10 µg (200 % VRN)"], ["Zinc", "10 mg (100 % VRN)"], ["Magnesio", "100 mg (27 % VRN)"]],
    alergenos: "no contiene.",
    modo: "1 cápsula al día con la comida principal.",
    opciones: [{ nombre: "Formato", valores: ["90 cápsulas"] }],
    variante: () => ({ sku: "MULTI-90", gramos: 120, precio: "14.90", stock: 75 }),
    imagen: () => ({ forma: "bote", color: "#3BA55D", nombre: ["MULTI", "VITAMÍNICO"], sabor: "Sport", peso: "90 cápsulas", dato: "Vitaminas C, D, zinc y magnesio", escala: 0.92 }),
  },
  {
    handle: "omega-3",
    ambiente: "omega-3", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-omega-3.jpg
    titulo: "Omega-3",
    tipo: "Salud",
    tags: "omega-3, epa, dha, salud",
    seo: "Omega-3 EPA y DHA, 120 perlas",
    descripcion: "Aceite de pescado rico en EPA y DHA. El EPA y el DHA contribuyen al funcionamiento normal del corazón; el efecto beneficioso se obtiene con una ingesta diaria de 250 mg de EPA y DHA.",
    tabla: [["Por 2 perlas", ""], ["Aceite de pescado", "2000 mg"], ["EPA", "360 mg"], ["DHA", "240 mg"]],
    alergenos: "<strong>pescado</strong>.",
    modo: "2 perlas al día con las comidas.",
    opciones: [{ nombre: "Formato", valores: ["120 perlas"] }],
    variante: () => ({ sku: "OMEGA-120", gramos: 180, precio: "16.90", stock: 40 }),
    imagen: () => ({ forma: "bote", color: "#1E6FA8", capsula: "#F4C430", nombre: ["OMEGA-3"], sabor: "EPA + DHA", peso: "120 perlas", dato: "600 mg EPA + DHA" }),
  },
  {
    handle: "vitamina-d3-k2",
    ambiente: "vitamina-d3", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-vitamina-d3.jpg
    titulo: "Vitamina D3 + K2",
    tipo: "Salud",
    tags: "vitamina d, vitamina k, huesos, salud",
    seo: "Vitamina D3 + K2, 60 cápsulas",
    descripcion: "Vitamina D3 y vitamina K2 en una sola cápsula. La vitamina D contribuye al mantenimiento de los huesos en condiciones normales.",
    tabla: [["Por cápsula", ""], ["Vitamina D3", "25 µg (500 % VRN)"], ["Vitamina K2", "75 µg (100 % VRN)"]],
    alergenos: "no contiene.",
    modo: "1 cápsula al día con una comida.",
    opciones: [{ nombre: "Formato", valores: ["60 cápsulas"] }],
    variante: () => ({ sku: "D3K2-60", gramos: 60, precio: "12.90", stock: 33 }),
    imagen: () => ({ forma: "bote", color: "#F4A300", nombre: ["VITAMINA", "D3 + K2"], sabor: "Huesos", peso: "60 cápsulas", dato: "1 cápsula al día", escala: 0.85 }),
  },
  {
    handle: "magnesio-bisglicinato",
    ambiente: "multivitaminico", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-multivitaminico.jpg
    titulo: "Magnesio Bisglicinato",
    tipo: "Salud",
    tags: "magnesio, minerales, salud",
    seo: "Magnesio bisglicinato, 120 cápsulas",
    descripcion: "Magnesio en forma de bisglicinato, de alta absorción. El magnesio contribuye a disminuir el cansancio y la fatiga.",
    tabla: [["Por 2 cápsulas", ""], ["Magnesio (bisglicinato)", "200 mg (53 % VRN)"]],
    alergenos: "no contiene.",
    modo: "2 cápsulas al día, preferiblemente por la noche.",
    opciones: [{ nombre: "Formato", valores: ["120 cápsulas"] }],
    variante: () => ({ sku: "MAG-120", gramos: 140, precio: "14.90", stock: 5 }),
    imagen: () => ({ forma: "bote", color: "#5C7AEA", nombre: ["MAGNESIO", "BISGLICINATO"], sabor: "Músculos", peso: "120 cápsulas", dato: "200 mg por dosis" }),
  },

  // ───────────────────────────── SNACKS ─────────────────────────────
  {
    handle: "barritas-proteicas-caja-12",
    titulo: "Barritas proteicas (caja de 12)",
    tipo: "Snacks",
    tags: "snack, barritas, proteina",
    seo: "Barritas proteicas 20 g de proteína, caja de 12",
    imagenBase: "barritas-proteicas",
    descripcion: "Barritas con 20 g de proteína y bajo contenido en azúcares. Caja de 12 unidades de 55 g.",
    tabla: [["Por barrita (55 g)", ""], ["Energía", "198 kcal"], ["Proteínas", "20 g"], ["Hidratos de carbono", "18 g"], ["de los cuales azúcares", "1,8 g"], ["Grasas", "6 g"], ["Sal", "0,3 g"]],
    alergenos: "<strong>leche</strong>, <strong>soja</strong>, <strong>cacahuete</strong> y <strong>gluten</strong>.",
    modo: "1 barrita como tentempié entre comidas.",
    opciones: [{ nombre: "Sabor", valores: ["Cookies", "Cacahuete"] }],
    variante: ([sabor]) => ({ sku: "BAR-" + sabor.slice(0, 3).toUpperCase(), gramos: 700, precio: "24.90", stock: sabor === "Cookies" ? 9 : 40 }),
    imagen: ([sabor]) => ({ forma: "caja", color: sabor === "Cookies" ? "#8A5A3B" : "#C68B3C", sabor }),
  },
  {
    handle: "galletas-proteicas-caja-12",
    ambiente: "galletas", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-galletas.jpg
    titulo: "Galletas proteicas (caja de 12)",
    tipo: "Snacks",
    tags: "snack, galletas, proteina",
    seo: "Galletas proteicas 15 g de proteína, caja de 12",
    imagenBase: "galletas-proteicas",
    descripcion: "Galletas grandes y tiernas con 15 g de proteína cada una. Caja de 12 unidades de 75 g.",
    tabla: [["Por galleta (75 g)", ""], ["Energía", "320 kcal"], ["Proteínas", "15 g"], ["Hidratos de carbono", "36 g"], ["de los cuales azúcares", "4 g"], ["Grasas", "12 g"], ["Sal", "0,6 g"]],
    alergenos: "<strong>leche</strong>, <strong>huevo</strong>, <strong>soja</strong> y <strong>gluten</strong>.",
    modo: "1 galleta como desayuno o merienda.",
    opciones: [{ nombre: "Sabor", valores: ["Chocolate", "Avena"] }],
    variante: ([sabor]) => ({ sku: "GAL-" + sabor.slice(0, 3).toUpperCase(), gramos: 950, precio: "22.90", stock: sabor === "Chocolate" ? 18 : 12 }),
    imagen: ([sabor]) => ({ forma: "caja", producto: "galleta", color: sabor === "Chocolate" ? "#4A2C20" : "#B98B4E", sabor }),
  },
  {
    handle: "crema-de-cacahuete",
    ambiente: "crema-cacahuete", // segunda foto (banco de imágenes): tienda/imagenes/ambiente/extra-crema-cacahuete.jpg
    titulo: "Crema de cacahuete",
    tipo: "Snacks",
    tags: "snack, cacahuete, proteina",
    seo: "Crema de cacahuete 100 % natural, 1 kg",
    descripcion: "Crema de cacahuete 100 % cacahuete tostado, sin azúcar, sin sal y sin aceite de palma.",
    tabla: [["Por 100 g", ""], ["Energía", "616 kcal"], ["Proteínas", "26 g"], ["Hidratos de carbono", "12 g"], ["de los cuales azúcares", "4,7 g"], ["Grasas", "50 g"], ["Sal", "0 g"]],
    alergenos: "<strong>cacahuete</strong>. Puede contener trazas de <strong>otros frutos de cáscara</strong>.",
    modo: "Untar en tostadas o añadir a batidos, tortitas o avena. Remover antes de usar.",
    opciones: [{ nombre: "Textura", valores: ["Natural", "Crunchy"] }],
    variante: ([t]) => ({ sku: "PB-" + t.slice(0, 3).toUpperCase(), gramos: 1000, precio: "9.90", stock: t === "Natural" ? 52 : 37 }),
    imagen: ([t]) => ({ forma: "tarro", tapa: "#E4572E", color: t === "Natural" ? "#C68B3C" : "#9C6A2F", color2: t === "Natural" ? "#a3702c" : "#7a5223", nombre: ["CREMA DE", "CACAHUETE"], sabor: t, peso: "1 kg", dato: "100 % cacahuete", escala: 0.8 }),
  },

  // ───────────────────────────── ACCESORIOS ─────────────────────────────
  {
    handle: "shaker-vigor-700",
    titulo: "Shaker Vigor 700 ml",
    tipo: "Accesorios",
    tags: "accesorios, shaker",
    seo: "Shaker Vigor 700 ml con rejilla mezcladora",
    descripcion: "Shaker de 700 ml con rejilla mezcladora, tapón antigoteo y medidas en ml y oz. Sin BPA y apto para lavavajillas.",
    sinNutricion: true,
    opciones: [{ nombre: "Color", valores: ["Negro", "Naranja"] }],
    variante: ([c]) => ({ sku: "SHK-" + c.slice(0, 3).toUpperCase(), gramos: 150, precio: "7.90", stock: c === "Negro" ? 64 : 45 }),
    imagen: ([c]) => ({ forma: "shaker", color: c === "Negro" ? "#1A1A1A" : "#E4572E" }),
  },
];

// ─────────────── Utilidades compartidas ───────────────

const sinAcentos = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
/** "1 kg" → "1kg", "Frutos rojos" → "frutos-rojos", "90 cápsulas" → "90-capsulas" */
export const slugValor = (v) => {
  const s = sinAcentos(v).toLowerCase().trim();
  return /^\d+([.,]\d+)?\s?(kg|g|ml)$/.test(s) ? s.replace(/\s/g, "") : s.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};
export const archivoImagen = (p, valores) => `${p.imagenBase ?? p.handle}-${valores.map(slugValor).join("-")}`;

export function descripcionHtml(p) {
  let h = `<p>${p.descripcion}</p>`;
  if (p.sinNutricion) return h;
  h += `<h3>Información nutricional</h3><table><tbody>${p.tabla.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody></table>`;
  h += `<p><strong>Alérgenos:</strong> ${p.alergenos}</p>`;
  h += `<p><strong>Modo de empleo:</strong> ${p.modo}</p>`;
  if (p.aviso) h += `<p><em>${p.aviso}</em></p>`;
  h += `<p><em>${AVISO_COMPLEMENTOS}</em></p>`;
  return h;
}
