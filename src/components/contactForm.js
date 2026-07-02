import { isValidEmail, isNotEmpty, minLength } from '../utils/validators.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

/**
 * Reglas de validación por campo.
 * Cada regla devuelve un mensaje de error (string) o null si es válido.
 */
const fieldRules = {
  name: (value) => (!isNotEmpty(value) ? 'El nombre es obligatorio.' : null),
  email: (value) => {
    if (!isNotEmpty(value)) return 'El correo es obligatorio.';
    if (!isValidEmail(value)) return 'Ingresa un correo válido.';
    return null;
  },
  message: (value) => {
    if (!isNotEmpty(value)) return 'El mensaje es obligatorio.';
    if (!minLength(value, 10)) return 'El mensaje debe tener al menos 10 caracteres.';
    return null;
  },
};

export function renderContactForm() {
  return `
    <section class="contact-section container" id="contacto">
      <h2 class="section-title">Contáctanos</h2>
      <div class="contact-layout">

        <div class="contact-form-wrapper">
          <form id="contact-form" class="contact-form" novalidate>
  <div class="form-group">
    <label for="name" class="form-label">
      <i class="fa-regular fa-user"></i> Nombre
    </label>
    <input type="text" id="name" name="name" class="form-input" autocomplete="name" />
    <p class="form-error" id="name-error" role="alert"></p>
  </div>

  <div class="form-group">
    <label for="email" class="form-label">
      <i class="fa-regular fa-envelope"></i> Correo electrónico
    </label>
    <input type="email" id="email" name="email" class="form-input" autocomplete="email" />
    <p class="form-error" id="email-error" role="alert"></p>
  </div>

  <div class="form-group">
    <label for="message" class="form-label">
      <i class="fa-regular fa-comment"></i> Mensaje
    </label>
    <textarea id="message" name="message" class="form-input" rows="5"></textarea>
    <p class="form-error" id="message-error" role="alert"></p>
  </div>

  <button type="submit" class="btn btn--primary" id="contact-submit-btn">
    <i class="fa-solid fa-paper-plane"></i> Enviar mensaje
  </button>

  <p class="form-feedback" id="form-feedback" role="status"></p>
</form>

          
           <a href="${buildWhatsAppLink('Hola, tengo una consulta sobre sus productos.')}"
            class="whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"><i class="fa-brands fa-whatsapp"></i>
            Escribir por WhatsApp
           </a>
        </div>

        <div class="contact-map" id="contact-map">
         <div class="map-placeholder">
           <p>📍 Santo Domingo Este, República Dominicana</p>
           <button class="btn btn--secondary" id="load-map-btn">Ver en el mapa</button>
         </div>
        </div>

      </div>
      </div>
    </section>
  `;
}

export function attachContactFormEvents() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = ['name', 'email', 'message'];

  // Validar al perder el foco (blur)
  fields.forEach((field) => {
    const input = document.getElementById(field);
    input.addEventListener('blur', () => validateField(field));

    // Si el campo ya tenía error, revalidar en cada tecla para que el error desaparezca al corregir
    input.addEventListener('input', () => {
      const errorEl = document.getElementById(`${field}-error`);
      if (errorEl.textContent) validateField(field);
    });
  });

  form.addEventListener('submit', handleSubmit);
  
  // Carga el mapa solo cuando el usuario hace click en "Ver en el mapa"
const loadMapBtn = document.getElementById('load-map-btn');
const mapContainer = document.getElementById('contact-map');

loadMapBtn?.addEventListener('click', () => {
  mapContainer.innerHTML = `
    <iframe
      src="https://www.google.com/maps?q=Santo%20Domingo%20Este,%20Rep%C3%BAblica%20Dominicana&output=embed"
      width="100%"
      height="100%"
      style="border:0;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Ubicación de la empresa en el mapa"
    ></iframe>
  `;
});
}

function validateField(field) {
  const input = document.getElementById(field);
  const errorEl = document.getElementById(`${field}-error`);
  const error = fieldRules[field](input.value);

  errorEl.textContent = error || '';
  input.setAttribute('aria-invalid', error ? 'true' : 'false');
  input.classList.toggle('form-input--error', Boolean(error));

  return !error;
}

function validateAll() {
  return ['name', 'email', 'message'].map(validateField).every(Boolean);
}

async function handleSubmit(e) {
  e.preventDefault();

  if (!validateAll()) return;

  const form = e.target;
  const submitBtn = document.getElementById('contact-submit-btn');
  const feedback = document.getElementById('form-feedback');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  feedback.textContent = '';
  feedback.className = 'form-feedback';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });

    if (!response.ok) throw new Error('Error en el envío');

    feedback.textContent = '¡Mensaje enviado correctamente! Te responderemos pronto.';
    feedback.classList.add('form-feedback--success');
    form.reset();
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    feedback.textContent = 'Hubo un error al enviar tu mensaje. Intenta de nuevo.';
    feedback.classList.add('form-feedback--error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensaje';
  }
}