import { formatPrice } from '../utils/formatPrice.js';

/**
 * Genera el HTML de una tarjeta de producto.
 * @param {object} product - documento de Firestore con id incluido
 */
export function renderProductCard(product) {
  const image = product.images?.[0] || 'https://via.placeholder.com/400x400?text=Sin+imagen';
  const outOfStock = Number(product.stock) <= 0;

  return `
    <article class="product-card">
      <a href="/producto.html?id=${product.id}" class="product-card__link" aria-label="Ver detalles de ${product.name}">
        <div class="product-card__image-wrap">
          <img src="${image}" alt="${product.name}" loading="lazy" class="product-card__image" />
          ${outOfStock ? '<span class="product-card__badge product-card__badge--danger">Sin stock</span>' : ''}
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${product.category || ''}</span>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__price">${formatPrice(product.price)}</p>
        </div>
      </a>
    </article>
  `;
}