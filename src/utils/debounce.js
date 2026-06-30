/**
 * Retrasa la ejecución de una función hasta que pasen `delay` ms
 * sin que se la vuelva a llamar. Útil para campos de búsqueda.
 * @param {Function} fn
 * @param {number} delay - milisegundos de espera
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}