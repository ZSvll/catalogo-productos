export function renderFooter() {
  const year = new Date().getFullYear();

  return `
    <footer class="footer">
      <div class="footer__inner">

        <div class="footer__brand">
          <span class="footer__logo">Momazos Tipxt<span class="footer__logo-dot">.</span></span>
          <p class="footer__tagline">Memes de  la más alta calidad en línea</p>
        </div>

        <nav class="footer__nav" aria-label="Enlaces del footer">
          <a href="/" class="footer__link">Inicio</a>
          <a href="/catalogo.html" class="footer__link">Catálogo</a>
          <a href="/acerca.html" class="footer__link">Acerca de</a>
          <a href="/faq.html" class="footer__link">FAQ</a>
          <a href="/privacidad.html" class="footer__link">Privacidad</a>
          <a href="/terminos.html" class="footer__link">Términos</a>
        </nav>

        <div class="footer__stack">
          <span class="footer__stack-label">Tecnologías</span>
          <div class="footer__stack-icons">
            <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer" class="footer__stack-icon" aria-label="Firebase" title="Firebase">
              <i class="fa-solid fa-fire"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="footer__stack-icon" aria-label="GitHub" title="GitHub">
              <i class="fa-brands fa-github"></i>
            </a>
            <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" class="footer__stack-icon" aria-label="Netlify" title="Netlify">
              <i class="fa-solid fa-cloud"></i>
            </a>
            <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" class="footer__stack-icon" aria-label="Cloudinary" title="Cloudinary">
              <i class="fa-solid fa-image"></i>
            </a>
          </div>
        </div>

      </div>

      <div class="footer__bottom">
        <p>&copy; ${year} Catálogo de Momazos. Todos los derechos reservados.</p>
      </div>
    </footer>
  `;
}