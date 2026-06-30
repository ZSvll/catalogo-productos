import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

const app = document.getElementById('app');

app.innerHTML = `
  ${renderNavbar('')}
  <main id="main-content">
    <section class="not-found container">
      <div class="not-found__content">
        <p class="not-found__code">404</p>
        <h1 class="not-found__title">Página no encontrada</h1>
        <p class="not-found__desc">
          La página que buscas no existe, fue movida o el enlace está roto.
        </p>
        <div class="not-found__actions">
          <a href="/" class="btn btn--primary">Ir al inicio</a>
          <a href="/catalogo.html" class="btn btn--secondary">Ver catálogo</a>
        </div>
      </div>
    </section>
  </main>
  ${renderFooter()}
`;

attachNavbarEvents();