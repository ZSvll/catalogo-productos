import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { initFaqPage } from './pages/faq.js';

const app = document.getElementById('app');
app.innerHTML = `
  ${renderNavbar('faq')}
  <main id="main-content"></main>
  ${renderFooter()}
`;
attachNavbarEvents();
initFaqPage('#main-content');