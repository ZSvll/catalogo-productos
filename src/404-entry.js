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
        <div class="not-found__divider"></div>
        <h1 class="not-found__title">Página no encontrada</h1>
        <p class="not-found__desc">
          El enlace puede estar roto o la página fue eliminada.<br/>
          Vuelve al inicio o explora el catálogo.
        </p>
        <div class="not-found__actions">
          <a href="/" class="btn btn--primary">
            <i class="fa-solid fa-house"></i> Ir al inicio
          </a>
          <a href="/catalogo.html" class="btn btn--secondary">
            <i class="fa-solid fa-grid-2"></i> Ver catálogo
          </a>
        </div>
      </div>
    </section>
  </main>
  ${renderFooter()}
`;

attachNavbarEvents();