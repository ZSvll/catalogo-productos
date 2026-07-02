import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

const app = document.getElementById('app');

app.innerHTML = `
  ${renderNavbar('catalog')}
  <main id="main-content"></main>
  ${renderFooter()}
`;

attachNavbarEvents();

import('./pages/catalog.js').then(({ initCatalog }) => {
  initCatalog('#main-content');
});