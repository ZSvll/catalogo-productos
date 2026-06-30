import { getAllActiveProducts } from '../services/productService.js';
import { getCategories } from '../services/categoryService.js';
import { renderProductCard } from '../components/productCard.js';
import { debounce } from '../utils/debounce.js';
 import { initScrollAnimations } from '../utils/animations.js';

// --- Estado local del catálogo ---
const state = {
  allProducts: [],    // Todos los productos traídos de Firestore (fuente de verdad)
  filtered: [],       // Subconjunto después de aplicar filtros
  searchQuery: '',
  activeCategory: '',
  sortOrder: 'newest',
};

export async function initCatalog(containerSelector) {
  const main = document.querySelector(containerSelector);

  main.innerHTML = `
    <section class="container featured-section animate-on-scroll" class="catalog-page container">
      <div class="catalog-header">
        <h1 class="section-title">Catálogo de productos</h1>
        <p class="catalog-count" id="catalog-count"></p>
      </div>

      <div class="catalog-layout">
        <!-- Sidebar de filtros -->
        <aside class="catalog-sidebar" id="catalog-sidebar">
          <button class="sidebar-toggle" id="sidebar-toggle"aria-expanded="false">
            ☰ Filtros y búsqueda
          </button>

          <div class="sidebar-content" id="sidebar-content">
            <div class="filter-group">
              <label for="search-input" class="filter-label">Buscar</label>
              <input type="search" id="search-input" class="filter-input" placeholder="Nombre del producto..." aria-label="Buscar productos"/>
            </div>

            <div class="filter-group">
              <p class="filter-label">Categoría</p>
              <div class="category-list" id="category-list">
                <button class="category-btn category-btn--active" data-slug="">Todas</button>
              </div>
            </div>

            <div class="filter-group">
              <label for="sort-select" class="filter-label">
                Ordenar por
              </label>
              <select id="sort-select" class="filter-input">
                <option value="newest">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre A→Z</option>
              </select>
            </div>

            <button
              class="btn btn--secondary"
              id="clear-filters-btn">
              Limpiar filtros
            </button>
          </div>
        </aside>

        <!-- Grid de productos -->
        <div class="catalog-content">
          <div class="catalog-grid" id="catalog-grid"></div>
        </div>
      </div>
    </section>
  `;

  renderSkeletons();
  readFiltersFromURL();
  await loadAllData();
  attachFilterEvents();
  initScrollAnimations();
}

// --- Carga de datos ---
async function loadAllData() {
  try {
    const [products, categories] = await Promise.all([
      getAllActiveProducts(),
      getCategories(),
    ]);

    state.allProducts = products;
    state.filtered = products;

    renderCategories(categories);
    applyFilters(); // Aplica filtros iniciales (por si hay parámetros en la URL)
  } catch (error) {
    console.error('Error al cargar datos del catálogo:', error);
    document.getElementById('catalog-grid').innerHTML = `
      <p class="state-text state-text--error">No se pudo cargar el catálogo. Intenta más tarde.</p>
    `;
  }
}

// --- Render de categorías ---
function renderCategories(categories) {
  const list = document.getElementById('category-list');
  const categoryBtns = categories
    .map(
      (cat) => `
      <button
        class="category-btn ${cat.slug === state.activeCategory ? 'category-btn--active' : ''}"
        data-slug="${cat.slug}"
      >
        ${cat.name}
      </button>`
    )
    .join('');
  list.insertAdjacentHTML('beforeend', categoryBtns);
}

// --- Lógica de filtrado y ordenamiento ---
function applyFilters() {
  let result = [...state.allProducts];

  // Filtro por texto
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q)
    );
  }

  // Filtro por categoría
  if (state.activeCategory) {
    result = result.filter((p) => p.categorySlug === state.activeCategory);
  }

  // Ordenamiento
  result.sort((a, b) => {
    switch (state.sortOrder) {
      case 'price-asc':  return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc':   return a.name?.localeCompare(b.name);
      default:           return 0; // 'newest' ya viene ordenado por Firestore
    }
  });

  state.filtered = result;
  renderProducts();
  updateURL();
  updateCount();
}

// --- Render del grid ---
function renderProducts() {
  const grid = document.getElementById('catalog-grid');

  if (state.filtered.length === 0) {
    grid.innerHTML = `<p class="state-text">No se encontraron productos con ese criterio.</p>`;
    return;
  }

  grid.innerHTML = state.filtered.map(renderProductCard).join('');
}

function renderSkeletons() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: 8 })
    .map(() => `<div class="skeleton-card"></div>`)
    .join('');
}

// --- Actualizar contador ---
function updateCount() {
  const countEl = document.getElementById('catalog-count');
  if (countEl) {
    countEl.textContent = `${state.filtered.length} ${state.filtered.length === 1 ? 'producto' : 'productos'}`;
  }
}

// --- Sincronización con URL ---
function updateURL() {
  const params = new URLSearchParams();
  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.activeCategory) params.set('categoria', state.activeCategory);
  if (state.sortOrder !== 'newest') params.set('orden', state.sortOrder);

  const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  history.replaceState(null, '', newURL);
}

function readFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  state.searchQuery = params.get('q') || '';
  state.activeCategory = params.get('categoria') || '';
  state.sortOrder = params.get('orden') || 'newest';

  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  if (searchInput) searchInput.value = state.searchQuery;
  if (sortSelect) sortSelect.value = state.sortOrder;
}

// --- Event listeners ---
function attachFilterEvents() {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const categoryList = document.getElementById('category-list');
  const clearBtn = document.getElementById('clear-filters-btn');

  searchInput?.addEventListener(
    'input',
    debounce((e) => {
      state.searchQuery = e.target.value.trim();
      applyFilters();
    }, 350)
  );

  sortSelect?.addEventListener('change', (e) => {
    state.sortOrder = e.target.value;
    applyFilters();
  });

  categoryList?.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;

    document.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('category-btn--active'));
    btn.classList.add('category-btn--active');

    state.activeCategory = btn.dataset.slug;
    applyFilters();
  });

  clearBtn?.addEventListener('click', () => {
    state.searchQuery = '';
    state.activeCategory = '';
    state.sortOrder = 'newest';

    document.getElementById('search-input').value = '';
    document.getElementById('sort-select').value = 'newest';
    document.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('category-btn--active'));
    document.querySelector('.category-btn[data-slug=""]')?.classList.add('category-btn--active');

    applyFilters();
  });

  // Toggle del sidebar en móvil
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarContent = document.getElementById('sidebar-content');

  sidebarToggle?.addEventListener('click', () => {
  const isOpen = sidebarContent.classList.toggle('sidebar-content--open');
  sidebarToggle.setAttribute('aria-expanded', String(isOpen));
  sidebarToggle.textContent = isOpen ? '✕ Cerrar filtros' : '☰ Filtros y búsqueda';
  });
}

