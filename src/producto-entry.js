import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

const app = document.getElementById('app');

app.innerHTML = `
  ${renderNavbar('')}
  <main id="main-content"></main>
  ${renderFooter()}
`;

attachNavbarEvents();

import('./pages/productDetail.js').then(({ initProductDetail }) => {
  initProductDetail('#main-content');
});