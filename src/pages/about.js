import { setPageMeta } from '../utils/seo.js';

export function initAboutPage(containerSelector) {
  setPageMeta({
    title: 'Acerca de Nosotros',
    description: 'Conoce más sobre nuestra empresa, misión y valores.',
  });

  const main = document.querySelector(containerSelector);

  main.innerHTML = `
    <section class="container static-page">
      <h1 class="section-title">Acerca de Nosotros</h1>

      <div class="static-content">
        <p>
          Somos una empresa dedicada a ofrecer productos de calidad a precios accesibles,
          con un servicio rápido y atención personalizada. Desde nuestros inicios, nuestro
          compromiso ha sido conectar a nuestros clientes con los mejores productos del mercado.
        </p>

        <h2>Nuestra misión</h2>
        <p>
          Facilitar el acceso a productos de calidad mediante una experiencia de compra
          simple, transparente y confiable.
        </p>

        <h2>Nuestros valores</h2>
        <ul class="static-list">
          <li>Transparencia en cada transacción</li>
          <li>Atención al cliente cercana y rápida</li>
          <li>Calidad garantizada en cada producto</li>
          <li>Mejora continua de nuestro servicio</li>
        </ul>
      </div>
    </section>
  `;
}