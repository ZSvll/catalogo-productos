// Carrusel genérico reutilizable. Genera su propio markup y adjunta su comportamiento.
// Uso: 1) buildCarouselMarkup(slides)  2) insertarlo en el DOM  3) initCarousel(selector)

/**
 * @param {Array<{image:string, title?:string, subtitle?:string}>} slides
 */
export function buildCarouselMarkup(slides) {
  const slidesHTML = slides
    .map((slide, i) => {
      const imageTag = `
        <img
          src="${slide.image}"
          alt="${slide.title || ''}"
          class="carousel__image"
          loading="${i === 0 ? 'eager' : 'lazy'}"
          fetchpriority="${i === 0 ? 'high' : 'auto'}"
        />`;

      // Si el slide tiene link, envuelve la imagen en un <a>
      const imageContent = slide.link
        ? `<a href="${slide.link}" class="carousel__slide-link" aria-label="Ver ${slide.title}">${imageTag}</a>`
        : imageTag;

      return `
        <div class="carousel__slide ${i === 0 ? 'carousel__slide--active' : ''}" data-index="${i}">
          ${imageContent}
          ${slide.title ? `
            <div class="carousel__caption">
              <h2>${slide.title}</h2>
              ${slide.subtitle ? `<p>${slide.subtitle}</p>` : ''}
            </div>` : ''}
        </div>`;
    })
    .join('');

  const dotsHTML = slides
    .map((_, i) => `
      <button
        class="carousel__dot ${i === 0 ? 'carousel__dot--active' : ''}"
        data-go-to="${i}"
        aria-label="Ir a la diapositiva ${i + 1}"
      ></button>`)
    .join('');

  return `
    <div class="carousel" role="region" aria-label="Carrusel de productos destacados">
      <div class="carousel__track">${slidesHTML}</div>
      <button class="carousel__arrow carousel__arrow--prev" aria-label="Anterior">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button class="carousel__arrow carousel__arrow--next" aria-label="Siguiente">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div class="carousel__dots">${dotsHTML}</div>
    </div>
  `;
}

/**
 * Adjunta el comportamiento (autoplay, navegación, swipe) a un carrusel ya insertado en el DOM.
 * @param {string} containerSelector - selector del elemento padre que contiene el carrusel
 */
export function initCarousel(containerSelector) {
  const root = document.querySelector(containerSelector);
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.carousel__slide'));
  const dots = Array.from(root.querySelectorAll('.carousel__dot'));
  const prevBtn = root.querySelector('.carousel__arrow--prev');
  const nextBtn = root.querySelector('.carousel__arrow--next');

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToSlide(index) {
    slides[currentIndex].classList.remove('carousel__slide--active');
    dots[currentIndex]?.classList.remove('carousel__dot--active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('carousel__slide--active');
    dots[currentIndex]?.classList.add('carousel__dot--active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function startAutoplay() {
    if (prefersReducedMotion || slides.length <= 1) return;
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  prevBtn?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    startAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(Number(dot.dataset.goTo));
      startAutoplay();
    });
  });

  // Pausa el autoplay cuando el mouse está sobre el carrusel
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);

  // Soporte táctil básico (swipe)
  let touchStartX = 0;
  root.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  root.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : goToSlide(currentIndex - 1);
      startAutoplay();
    }
  });

  startAutoplay();
}