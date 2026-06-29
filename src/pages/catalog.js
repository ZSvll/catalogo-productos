import { getProductsPaginated } from '../services/productService.js';
import { renderProductCard } from '../components/productCard.js';

// Estado del módulo: guardamos el cursor de paginación entre clicks
let lastVisibleDoc = null;
let isLoading = false;

export async function initCatalog(containerSelector) {
  const main = document.querySelector(containerSelector);

  main.innerHTML = `
    <section class="container catalog-page">
      <h1 class="section-title">Catálogo de productos</h1>
      <div class="catalog-grid" id="catalog-grid"></div>
      <div class="catalog-footer">
        <button id="load-more-btn" class="btn btn--secondary" hidden>Cargar más productos</button>
      </div>
    </section>
  `;

  renderSkeletons();
  await loadProducts();

  document.getElementById('load-more-btn').addEventListener('click', loadProducts);
}

/** Muestra placeholders animados mientras llega la primera respuesta de Firestore */
function renderSkeletons() {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = Array.from({ length: 8 })
    .map(() => `<div class="skeleton-card"></div>`)
    .join('');
}

async function loadProducts() {
  if (isLoading) return;
  isLoading = true;

  const grid = document.getElementById('catalog-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const isFirstLoad = lastVisibleDoc === null;

  loadMoreBtn.textContent = 'Cargando...';
  loadMoreBtn.disabled = true;

  try {
    const { products, lastVisible, hasMore } = await getProductsPaginated(lastVisibleDoc);
    lastVisibleDoc = lastVisible;

    if (isFirstLoad) {
      grid.innerHTML = ''; // Limpia los skeletons
    }

    if (isFirstLoad && products.length === 0) {
      grid.innerHTML = `<p class="state-text">No hay productos disponibles por el momento.</p>`;
    } else {
      grid.insertAdjacentHTML('beforeend', products.map(renderProductCard).join(''));
    }

    loadMoreBtn.hidden = !hasMore;
    loadMoreBtn.textContent = 'Cargar más productos';
    loadMoreBtn.disabled = false;
  } catch (error) {
    console.error('Error al cargar catálogo:', error);
    if (isFirstLoad) {
      grid.innerHTML = `<p class="state-text state-text--error">No se pudieron cargar los productos. Intenta más tarde.</p>`;
    }
    loadMoreBtn.hidden = true;
  } finally {
    isLoading = false;
  }
}