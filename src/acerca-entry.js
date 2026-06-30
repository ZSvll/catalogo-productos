import './style.css';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { initAboutPage } from './pages/about.js';

const app = document.getElementById('app');
app.innerHTML = `
  ${renderNavbar('about')}
  <main id="main-content"></main>
  ${renderFooter()}
`;
attachNavbarEvents();
initAboutPage('#main-content');