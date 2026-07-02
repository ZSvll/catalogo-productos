const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Guardamos una referencia al observer para poder desconectarlo y reconectarlo
let scrollObserver = null;

export function initScrollAnimations() {
  if (prefersReducedMotion) {
    // Si prefiere menos movimiento, hace todos los elementos visibles directamente
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  // Desconectar el observer anterior si existe
  if (scrollObserver) {
    scrollObserver.disconnect();
  }

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('is-visible');
        }, Number(delay));
        scrollObserver.unobserve(el);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px',
    }
  );

  // Solo observa elementos que AÚN no son visibles
  document.querySelectorAll('.animate-on-scroll:not(.is-visible)').forEach((el) => {
    scrollObserver.observe(el);
  });
}