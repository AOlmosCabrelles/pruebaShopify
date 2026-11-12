// Calculadora de proteína de Vigor Manager (se ejecuta en la tienda).
(() => {
  const calcular = (raiz) => {
    const proteina = Number(raiz.dataset.proteina);
    const dosisG = Number(raiz.dataset.dosisG);
    const porcentaje = Number(raiz.dataset.porcentaje) / 100;
    const variantes = JSON.parse(raiz.querySelector("[data-vigor-variantes]").textContent || "{}");
    const varianteInicial = JSON.parse(raiz.querySelector("[data-vigor-variante-inicial]").textContent || "null");

    const varianteActual = () => {
      const url = new URL(window.location.href).searchParams.get("variant");
      const input = document.querySelector('form[action*="/cart/add"] [name="id"]');
      return url || (input && input.value) || varianteInicial;
    };

    const pintar = () => {
      const peso = Number(raiz.querySelector("[data-vigor-peso]").value);
      const factor = Number(raiz.querySelector("[data-vigor-objetivo]").value);
      const salida = raiz.querySelector("[data-vigor-resultado]");
      if (!(peso > 0)) {
        salida.textContent = "";
        return;
      }
      const totalDia = Math.round(peso * factor);
      const dosisDia = Math.max(1, Math.round((totalDia * porcentaje) / proteina));
      const gramosEnvase = Number(variantes[String(varianteActual())] || 0);
      const dias = gramosEnvase ? Math.floor(gramosEnvase / (dosisDia * dosisG)) : 0;

      salida.innerHTML =
        `Necesitas unos <b>${totalDia} g de proteína al día</b>. ` +
        `Con <b>${dosisDia} dosis</b> diarias (${dosisDia * proteina} g) cubres el ${Math.round(porcentaje * 100)} % con el suplemento` +
        (dias ? ` y este envase te dura unos <b>${dias} días</b>.` : ".");
    };

    raiz.addEventListener("input", pintar);
    document.addEventListener("change", pintar); // cambio de variante en el tema
    pintar();
  };

  const iniciar = () => document.querySelectorAll(".vigor-calc").forEach(calcular);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
