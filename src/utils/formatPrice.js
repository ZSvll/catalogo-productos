// Formatea números como moneda. Centralizado para que toda la app use el mismo formato.
export function formatPrice(value, currency = 'USD') {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
  }).format(value);
}