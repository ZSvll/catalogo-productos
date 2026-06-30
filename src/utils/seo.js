// Aplica meta tags dinámicos de SEO desde JS, para mantener consistencia
// entre páginas sin repetir lógica.

/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.description
 */
export function setPageMeta({ title, description }) {
  document.title = `${title} | Catálogo de Productos`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  // Open Graph: usados por WhatsApp, Facebook, etc. al compartir el link
  setOrCreateMeta('property', 'og:title', title);
  setOrCreateMeta('property', 'og:description', description);
}

function setOrCreateMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}