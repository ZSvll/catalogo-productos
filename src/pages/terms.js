import { setPageMeta } from '../utils/seo.js';

export function initTermsPage(containerSelector) {
  setPageMeta({
    title: 'Términos y Condiciones',
    description: 'Condiciones de uso del sitio y de compra de productos.',
  });

  const main = document.querySelector(containerSelector);

  main.innerHTML = `
    <section class="container static-page">
      <h1 class="section-title">Términos y Condiciones</h1>

      <div class="static-content">
        <h2>1. Aceptación de los términos</h2>
        <p>
          Al acceder y utilizar este sitio, aceptas cumplir con estos Términos y Condiciones.
          Si no estás de acuerdo, te recomendamos no utilizar el sitio.
        </p>

        <h2>2. Disponibilidad de productos</h2>
        <p>
          Los precios y disponibilidad de los productos mostrados están sujetos a cambios sin
          previo aviso. Haremos nuestro mejor esfuerzo por mantener la información actualizada.
        </p>

        <h2>3. Proceso de compra</h2>
        <p>
          Las compras se coordinan directamente vía WhatsApp o el formulario de contacto. La
          confirmación final del pedido se realiza por ese canal.
        </p>

        <h2>4. Propiedad intelectual</h2>
        <p>
          Todo el contenido de este sitio (textos, imágenes, diseño) es propiedad de la
          empresa y no puede ser reproducido sin autorización previa.
        </p>

        <h2>5. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los
          cambios serán efectivos desde su publicación en esta página.
        </p>
      </div>
    </section>
  `;
}