import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Vigor Manager</h1>
        <p className={styles.text}>
          La app para tiendas de suplementación deportiva: controla lotes, caducidades y stock, y ayuda a tus clientes a elegir.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Dominio de la tienda</span>
              <input className={styles.input} type="text" name="shop" />
              <span>p. ej.: mi-tienda.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Entrar
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Lotes y caducidad</strong>. Aviso de los lotes que caducan pronto y del stock bajo.
          </li>
          <li>
            <strong>Lotes y caducidad</strong>. Aviso de los lotes que caducan pronto y del stock bajo.
          </li>
          <li>
            <strong>Lotes y caducidad</strong>. Aviso de los lotes que caducan pronto y del stock bajo.
          </li>
        </ul>
      </div>
    </div>
  );
}
