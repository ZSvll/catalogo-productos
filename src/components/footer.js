// src/components/footer.js

export function renderFooter() {
  const year = new Date().getFullYear();

  return `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <h3 class="footer__heading">Catálogo</h3>
            <a href="/" class="footer__link">Inicio</a>
            <a href="/catalogo.html" class="footer__link">Productos</a>
          </div>
          <div>
            <h3 class="footer__heading">Legal</h3>
            <a href="/privacidad.html" class="footer__link">Política de privacidad</a>
            <a href="/terminos.html" class="footer__link">Términos y condiciones</a>
          </div>
          <div>
            <h3 class="footer__heading">Contacto</h3>
            <a href="mailto:contacto@catalogo.com" class="footer__link">contacto@catalogo.com</a>
          </div>
        </div>
        <div class="footer__bottom">
          <p>&copy; ${year} Catálogo de Productos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `;
}