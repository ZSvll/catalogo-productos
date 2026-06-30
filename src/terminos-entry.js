import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { initTermsPage } from './pages/terms.js';

const app = document.getElementById('app');
app.innerHTML = `
  ${renderNavbar('')}
  <main id="main-content"></main>
  ${renderFooter()}
`;
attachNavbarEvents();
initTermsPage('#main-content');