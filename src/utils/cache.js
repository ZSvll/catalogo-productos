// Caché en memoria simple para la sesión actual.
// Evita hacer la misma query a Firestore dos veces mientras el usuario navega.
// Se limpia automáticamente al recargar la página (es intencional: queremos datos frescos en cada sesión).

const store = new Map();

/**
 * Obtiene un valor cacheado o lo genera si no existe.
 * @param {string} key - identificador único del dato
 * @param {Function} fetchFn - función async que obtiene el dato si no está en caché
 * @param {number} ttlMs - tiempo de vida en ms (default: 5 minutos)
 */
export async function getCached(key, fetchFn, ttlMs = 5 * 60 * 1000) {
  const cached = store.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  const data = await fetchFn();
  store.set(key, { data, timestamp: now });
  return data;
}

/** Invalida una entrada específica del caché (útil tras crear/editar un producto en el admin) */
export function invalidateCache(key) {
  store.delete(key);
}

/** Limpia todo el caché (útil al cerrar sesión del admin) */
export function clearCache() {
  store.clear();
}