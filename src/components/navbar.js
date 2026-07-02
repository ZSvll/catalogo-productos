import { toggleTheme, getCurrentTheme } from '../utils/theme.js';

export function renderNavbar(activePage = '') {
  const isActive = (page) => page === activePage ? 'navbar__link--active' : '';

  return `
    <header class="navbar">
      <div class="navbar__container">
        <a href="/" class="navbar__logo">
          Momazos Tipxt<span>.</span>
        </a>

        <nav class="navbar__links" id="navbar-links" aria-label="Navegación principal">
          <a href="/" class="navbar__link ${isActive('home')}">Inicio</a>
          <a href="/catalogo.html" class="navbar__link ${isActive('catalog')}">Catálogo</a>
          <a href="/acerca.html" class="navbar__link ${isActive('about')}">Acerca de</a>
          <a href="/faq.html" class="navbar__link ${isActive('faq')}">FAQ</a>
          <a href="/#contacto" class="navbar__link ${isActive('contact')}">Contacto</a>
        </nav>

        <div class="navbar__controls">
          <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema claro/oscuro">
            <i class="fa-solid fa-moon" id="theme-icon"></i>
          </button>
          <button class="navbar__toggle" id="navbar-toggle" aria-label="Abrir menú" aria-expanded="false">
            <i class="fa-solid fa-bars" id="menu-icon"></i>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function attachNavbarEvents() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileToggleBtn = document.getElementById('navbar-toggle');
  const navLinks = document.getElementById('navbar-links');
  const themeIcon = document.getElementById('theme-icon');
  const menuIcon = document.getElementById('menu-icon');

  updateThemeIcon();

  themeToggleBtn?.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });

  mobileToggleBtn?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('navbar__links--open');
    mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
    menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });

  function updateThemeIcon() {
    const isDark = getCurrentTheme() === 'dark';
    themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}