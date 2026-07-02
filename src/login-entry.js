import './style.css';
import { initLoginPage } from './pages/login.js';

// La página de login no usa el navbar/footer del sitio público
// Tiene su propio layout minimalista centrado
const app = document.getElementById('app');
app.innerHTML = '<div id="main-content"></div>';

initLoginPage('#main-content');