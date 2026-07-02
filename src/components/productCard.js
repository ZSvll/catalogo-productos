import { formatPrice } from '../utils/formatPrice.js';

/**
 * Transforma una URL de Cloudinary para servir la imagen en el tamaño óptimo.
 * Si la URL no es de Cloudinary (ej. placeholder), la devuelve sin cambios.
 * @param {string} url
 * @param {number} width
 */
function optimizeCloudinaryUrl(url, width = 400) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Inserta parámetros de transformación: ancho, calidad auto, formato auto (WebP si el navegador lo soporta)
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

export function renderProductCard(product) {
  const rawImage = product.images?.[0] || 'https://via.placeholder.com/400x400?text=Sin+imagen';
  const image = optimizeCloudinaryUrl(rawImage, 400);
  const outOfStock = Number(product.stock) <= 0;

  return `
    <article class="product-card animate-on-scroll">
      <a href="/producto.html?id=${product.id}" class="product-card__link" aria-label="Ver detalles de ${product.name}">
        <div class="product-card__image-wrap">
          <img
            src="${image}"
            alt="${product.name}"
            loading="lazy"
            decoding="async"
            class="product-card__image"
            width="400"
            height="400"
          />
          ${outOfStock ? '<span class="product-card__badge product-card__badge--danger">Sin stock</span>' : ''}
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${product.categoryName || product.categorySlug || ''}</span>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__price">${formatPrice(product.price)}</p>
        </div>
      </a>
    </article>
  `;
}