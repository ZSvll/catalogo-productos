import { getProductById } from '../services/productService.js';
import { formatPrice } from '../utils/formatPrice.js';

export async function initProductDetail(containerSelector) {
  const main = document.querySelector(containerSelector);

  // Leer el ID del producto desde la URL (?id=abc123)
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  // Si no hay ID en la URL, redirige a 404
  if (!productId) {
    window.location.href = '/404.html';
    return;
  }

  renderSkeleton(main);

  try {
    const product = await getProductById(productId);

    // Actualizar el título de la pestaña con el nombre real del producto (SEO)
    document.title = `${product.name} | Catálogo de Productos`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', product.description || product.name);

    main.innerHTML = buildDetailHTML(product);
    attachGalleryEvents();
  } catch (error) {
    // Producto no encontrado o error de red → redirige a 404
    console.error('Error al cargar el producto:', error);
    window.location.href = '/404.html';
  }
}

// --- Skeleton de carga ---
function renderSkeleton(container) {
  container.innerHTML = `
    <div class="container product-detail-page">
      <div class="skeleton-card" style="height: 24px; width: 280px; margin-bottom: 2rem;"></div>
      <div class="product-detail">
        <div class="skeleton-card product-gallery"></div>
        <div class="product-info" style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="skeleton-card" style="height: 32px; width: 80%;"></div>
          <div class="skeleton-card" style="height: 20px; width: 40%;"></div>
          <div class="skeleton-card" style="height: 48px; width: 50%;"></div>
          <div class="skeleton-card" style="height: 100px;"></div>
        </div>
      </div>
    </div>
  `;
}

// --- Construir HTML del detalle ---
function buildDetailHTML(product) {
  const images = product.images?.length ? product.images : ['https://via.placeholder.com/600x600?text=Sin+imagen'];
  const inStock = Number(product.stock) > 0;
  const createdAt = product.createdAt?.toDate
    ? new Intl.DateTimeFormat('es-DO', { dateStyle: 'long' }).format(product.createdAt.toDate())
    : '';

  const thumbnailsHTML = images
    .map(
      (img, i) => `
      <button
        class="gallery-thumb ${i === 0 ? 'gallery-thumb--active' : ''}"
        data-index="${i}"
        aria-label="Ver imagen ${i + 1}"
      >
        <img src="${img}" alt="Miniatura ${i + 1}" loading="lazy" />
      </button>`
    )
    .join('');

  return `
    <div class="container product-detail-page">

      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Ruta de navegación">
        <ol>
          <li><a href="/">Inicio</a></li>
          <li><a href="/catalogo.html">Catálogo</a></li>
          ${product.categoryName ? `<li><a href="/catalogo.html?categoria=${product.categorySlug}">${product.categoryName}</a></li>` : ''}
          <li aria-current="page">${product.name}</li>
        </ol>
      </nav>

      <div class="product-detail">

        <!-- Galería -->
        <div class="product-gallery">
          <div class="gallery-main">
            <img
              id="gallery-main-img"
              src="${images[0]}"
              alt="${product.name}"
              class="gallery-main__img"
              loading="eager"
            />
          </div>
          ${images.length > 1 ? `<div class="gallery-thumbs">${thumbnailsHTML}</div>` : ''}
        </div>

        <!-- Info del producto -->
        <div class="product-info">
          ${product.categoryName ? `<span class="product-card__category">${product.categoryName}</span>` : ''}

          <h1 class="product-info__name">${product.name}</h1>

          <div class="product-info__meta">
            <span class="product-info__code">Código: <strong>${product.code || 'N/A'}</strong></span>
            <span class="badge ${inStock ? 'badge--success' : 'badge--danger'}">
              ${inStock ? `En stock (${product.stock})` : 'Sin stock'}
            </span>
          </div>

          <p class="product-info__price">${formatPrice(product.price)}</p>

          <div class="product-info__description">
            <h2 class="product-info__desc-title">Descripción</h2>
            <p>${product.description || 'Sin descripción disponible.'}</p>
          </div>

          ${createdAt ? `<p class="product-info__date">Publicado el ${createdAt}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}

// --- Galería interactiva ---
function attachGalleryEvents() {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb');

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = Number(thumb.dataset.index);
      const newSrc = thumb.querySelector('img').src;

      mainImg.src = newSrc;

      thumbs.forEach((t) => t.classList.remove('gallery-thumb--active'));
      thumb.classList.add('gallery-thumb--active');
    });
  });
}