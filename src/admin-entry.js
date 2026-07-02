import './style.css';
import { getCurrentUser } from './services/authService.js';

async function init() {
  // Protección de ruta: si no hay sesión, redirige al login
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  // Placeholder hasta el Módulo 13
  document.getElementById('app').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:center; height:100vh; flex-direction:column; gap:1rem;">
      <h1>Panel Admin</h1>
      <p>Sesión activa: <strong>${user.email}</strong></p>
      <p>El panel completo se construye en el Módulo 13.</p>
    </div>
  `;
}

init();