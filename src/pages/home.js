import { getFeaturedProducts } from '../services/productService.js';
import { renderProductCard } from '../components/productCard.js';
import { buildCarouselMarkup, initCarousel } from '../components/carousel.js';
import { renderContactForm, attachContactFormEvents } from '../components/contactForm.js';
import { initScrollAnimations } from '../utils/animations.js';



// Slides temporales: reemplaza estas imágenes por las reales cuando tengas branding propio
const heroSlides = [
  {
    image: 'https://picsum.photos/1600/600?random=1',
    title: 'Bienvenido a nuestro catálogo',
    subtitle: 'Encuentra los mejores productos al mejor precio',
  },
  {
    image: 'https://picsum.photos/1600/600?random=2',
    title: 'Nuevos productos cada semana',
    subtitle: 'Calidad garantizada',
  },
  {
    image: 'https://picsum.photos/1600/600?random=3',
    title: 'Envíos a todo el país',
    subtitle: 'Rápido y seguro',
  },
];

export async function initHome(containerSelector) {
  const main = document.querySelector(containerSelector);

  main.innerHTML = `
    <section class="hero" id="hero-carousel"></section>
    <section class="container featured-section animate-on-scroll">
      <h2 class="section-title">Productos destacados</h2>
      <div class="featured-grid" id="featured-grid">
        <p class="state-text">Cargando productos...</p>
      </div>
    </section>
    ${renderContactForm()}
  `;

  document.getElementById('hero-carousel').innerHTML = buildCarouselMarkup(heroSlides);
  initCarousel('#hero-carousel');

  await loadFeaturedProducts();
  attachContactFormEvents();
  await loadFeaturedProducts();
  attachContactFormEvents();
  initScrollAnimations(); 
  }


async function loadFeaturedProducts() {
  const grid = document.getElementById('featured-grid');

  try {
    const products = await getFeaturedProducts(8);

    if (products.length === 0) {
      grid.innerHTML = `<p class="state-text">Aún no hay productos destacados disponibles.</p>`;
      return;
    }

    grid.innerHTML = products.map(renderProductCard).join('');
  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
    grid.innerHTML = `<p class="state-text state-text--error">No se pudieron cargar los productos. Intenta más tarde.</p>`;
  }
}