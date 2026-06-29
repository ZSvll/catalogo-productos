// src/utils/theme.js
// Lógica centralizada de modo oscuro/claro.
// El script inline en index.html ya aplicó el tema inicial al cargar;
// este módulo se usa para CAMBIARLO después, en respuesta a clicks del usuario.

const THEME_KEY = 'theme';

/** Devuelve el tema actualmente aplicado al documento */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

/** Alterna entre claro y oscuro, y persiste la elección */
export function toggleTheme() {
  const newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}