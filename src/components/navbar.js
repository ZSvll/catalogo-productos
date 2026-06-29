// src/components/navbar.js
// Genera el HTML del navbar y adjunta su lógica de interacción (menú móvil + toggle de tema).
// Se exporta una función para que cualquier página pueda inyectarlo.

import { toggleTheme, getCurrentTheme } from '../utils/theme.js';

/**
 * Devuelve el HTML del navbar como string.
 * @param {string} activePage - identifica el link activo (ej. 'home', 'catalog')
 */
export function renderNavbar(activePage = '') {
  const isActive = (page) => (page === activePage ? 'navbar__link--active' : '');

  return `
    <header class="navbar">
      <div class="navbar__container">
        <a href="/" class="navbar__logo">Catálogo<span style="color: var(--color-primary)">.</span></a>

        <nav class="navbar__links" id="navbar-links" aria-label="Navegación principal">
          <a href="/" class="navbar__link ${isActive('home')}">Inicio</a>
          <a href="/catalogo.html" class="navbar__link ${isActive('catalog')}">Catálogo</a>
          <a href="/#contacto" class="navbar__link ${isActive('contact')}">Contacto</a>
          <a href="/#faq" class="navbar__link ${isActive('faq')}">FAQ</a>
        </nav>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema claro/oscuro">
            🌙
          </button>
          <button class="navbar__toggle" id="navbar-toggle" aria-label="Abrir menú" aria-expanded="false">
            ☰
          </button>
        </div>
      </div>
    </header>
  `;
}

/**
 * Adjunta los event listeners del navbar.
 * Debe llamarse DESPUÉS de insertar el HTML del navbar en el DOM.
 */
export function attachNavbarEvents() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileToggleBtn = document.getElementById('navbar-toggle');
  const navLinks = document.getElementById('navbar-links');

  // Actualiza el ícono del botón según el tema actual al cargar
  updateThemeIcon();

  themeToggleBtn?.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });

  mobileToggleBtn?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('navbar__links--open');
    mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  function updateThemeIcon() {
    themeToggleBtn.textContent = getCurrentTheme() === 'dark' ? '☀️' : '🌙';
  }
}