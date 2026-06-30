// Anima elementos cuando entran al viewport usando IntersectionObserver.
// Uso: agrega class="animate-on-scroll" a cualquier elemento HTML,
// y opcionalmente data-delay="200" para retrasar la animación en ms.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Inicializa el observer de animaciones al hacer scroll.
 * Llamar una vez al montar cada página.
 */
export function initScrollAnimations() {
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = el.dataset.delay || 0;

        setTimeout(() => {
          el.classList.add('is-visible');
        }, Number(delay));

        // Dejar de observar una vez animado (la animación es de una sola vez)
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.1,     // Se activa cuando el 10% del elemento es visible
      rootMargin: '0px 0px -40px 0px', // Empieza un poco antes del borde inferior
    }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}