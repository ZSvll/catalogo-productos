import './style.css';
import { getCurrentUser, logout, onAuthChange } from './services/authService.js';

async function init() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  // Carga el módulo del admin dinámicamente (Firebase ya está listo)
  const { initAdminPanel } = await import('./pages/admin.js');
  initAdminPanel(user);

  // Si la sesión expira mientras trabaja, redirige al login
  onAuthChange((currentUser) => {
    if (!currentUser) window.location.href = '/login.html';
  });
}

init();