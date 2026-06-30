import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { initProductDetail } from './pages/productDetail.js';

const app = document.getElementById('app');

app.innerHTML = `
  ${renderNavbar('')}
  <main id="main-content"></main>
  ${renderFooter()}
`;

attachNavbarEvents();
initProductDetail('#main-content');