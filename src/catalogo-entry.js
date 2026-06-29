// Entry point exclusivo de catalogo.html.
// Mismo patrón que main.js: monta layout + delega contenido a la página.
import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { initCatalog } from './pages/catalog.js';

const app = document.getElementById('app');

app.innerHTML = `
  ${renderNavbar('catalog')}
  <main id="main-content"></main>
  ${renderFooter()}
`;

attachNavbarEvents();
initCatalog('#main-content');