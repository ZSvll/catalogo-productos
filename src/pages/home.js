import { getFeaturedProducts } from '../services/productService.js';
import { renderProductCard } from '../components/productCard.js';
import { buildCarouselMarkup, initCarousel } from '../components/carousel.js';
import { renderContactForm, attachContactFormEvents } from '../components/contactForm.js';
import { initScrollAnimations } from '../utils/animations.js';

export async function initHome(containerSelector) {
  const main = document.querySelector(containerSelector);

  // Estructura base mientras cargan los datos
  main.innerHTML = `
    <section class="hero" id="hero-carousel">
      <div class="carousel-skeleton"></div>
    </section>
    <section class="container featured-section animate-on-scroll">
      <h2 class="section-title">Productos destacados</h2>
      <div class="featured-grid" id="featured-grid">
        ${Array.from({ length: 4 }).map(() => '<div class="skeleton-card"></div>').join('')}
      </div>
    </section>
    ${renderContactForm()}
  `;

  attachContactFormEvents();

  // Carga los productos destacados una sola vez y los usa para ambas secciones
  await loadFeaturedContent();
  initScrollAnimations();
}

async function loadFeaturedContent() {
  const grid = document.getElementById('featured-grid');
  const heroSection = document.getElementById('hero-carousel');

  try {
    const products = await getFeaturedProducts(8);

    // --- Carrusel ---
    if (products.length === 0) {
      // Sin productos destacados: oculta el carrusel completamente
      heroSection.style.display = 'none';
    } else {
      // Construye los slides desde los productos destacados
      const slides = products.map((product) => ({
        image: product.images?.[0] || 'https://via.placeholder.com/1600x600?text=Sin+imagen',
        title: product.name,
        subtitle: product.categoryName || '',
        link: `/producto.html?id=${product.id}`,
      }));

      heroSection.innerHTML = buildCarouselMarkup(slides);
      initCarousel('#hero-carousel');
    }

    // --- Grid de productos destacados ---
    if (products.length === 0) {
      grid.innerHTML = `<p class="state-text">Aún no hay productos destacados disponibles.</p>`;
      return;
    }

    grid.innerHTML = products.map(renderProductCard).join('');

  } catch (error) {
    console.error('Error al cargar contenido destacado:', error);
    heroSection.style.display = 'none';
    grid.innerHTML = `<p class="state-text state-text--error">No se pudieron cargar los productos. Intenta más tarde.</p>`;
  }
}