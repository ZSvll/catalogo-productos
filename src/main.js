import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

const app = document.getElementById('app');

app.innerHTML = `
  ${renderNavbar('home')}
  <main id="main-content" style="min-height: calc(100vh - var(--header-height))"></main>
  ${renderFooter()}
`;

attachNavbarEvents();

// Dynamic import: Firebase y la lógica de home solo cargan después del primer paint
// Esto libera el main thread para pintar la UI antes de ejecutar JS pesado
import('./pages/home.js').then(({ initHome }) => {
  initHome('#main-content');
});