import './style.css';
import { initLoginPage } from './pages/login.js';

// La página de login no usa el navbar/footer del sitio público
// Tiene su propio layout minimalista centrado
const app = document.getElementById('app');
app.innerHTML = '<div id="main-content"></div>';

initLoginPage('#main-content');

// Captura errores JS no manejados y evita pantallas en blanco silenciosas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada sin manejar:', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('Error global:', event.message);
});