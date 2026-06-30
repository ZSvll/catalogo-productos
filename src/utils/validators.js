// Funciones puras de validación, reutilizables en cualquier formulario del sitio.

export function isValidEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
}

export function isNotEmpty(value) {
  return value.trim().length > 0;
}

export function minLength(value, length) {
  return value.trim().length >= length;
}