import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { initPrivacyPage } from './pages/privacy.js';

const app = document.getElementById('app');
app.innerHTML = `
  ${renderNavbar('')}
  <main id="main-content"></main>
  ${renderFooter()}
`;
attachNavbarEvents();
initPrivacyPage('#main-content');