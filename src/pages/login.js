import { login, getCurrentUser } from '../services/authService.js';
import { isValidEmail, isNotEmpty } from '../utils/validators.js';

export async function initLoginPage(containerSelector) {
  const main = document.querySelector(containerSelector);

  // Si ya hay sesión activa, redirige directo al panel
  const user = await getCurrentUser();
  if (user) {
    window.location.href = '/admin.html';
    return;
  }

  main.innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">Catálogo<span style="color: var(--color-primary)">.</span></h1>
          <p class="login-subtitle">Panel de administración</p>
        </div>

        <form id="login-form" class="login-form" novalidate>
          <div class="form-group">
            <label for="login-email" class="form-label">Correo electrónico</label>
            <input
              type="email"
              id="login-email"
              class="form-input"
              autocomplete="email"
              placeholder="admin@ejemplo.com"
            />
            <p class="form-error" id="login-email-error" role="alert"></p>
          </div>

          <div class="form-group">
            <label for="login-password" class="form-label">Contraseña</label>
            <div class="password-wrapper">
              <input
                type="password"
                id="login-password"
                class="form-input"
                autocomplete="current-password"
                placeholder="••••••••"
              />
              <button type="button" class="password-toggle" id="password-toggle" aria-label="Mostrar contraseña">
              <i class="fa-regular fa-eye" id="eye-icon"></i>
              </button>
            </div>
            <p class="form-error" id="login-password-error" role="alert"></p>
          </div>

          <button type="submit" class="btn btn--primary login-submit" id="login-submit-btn">
            Iniciar sesión
          </button>

          <p class="form-feedback" id="login-feedback" role="alert"></p>
        </form>

        <a href="/" class="login-back">← Volver al sitio</a>
      </div>
    </div>
  `;

  attachLoginEvents();
}

function attachLoginEvents() {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const passwordToggle = document.getElementById('password-toggle');

  // Toggle para mostrar/ocultar contraseña
  const eyeIcon = document.getElementById('eye-icon');
  passwordToggle.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
});

  // Validar al perder foco
  emailInput.addEventListener('blur', () => validateLoginField('login-email'));
  passwordInput.addEventListener('blur', () => validateLoginField('login-password'));

  form.addEventListener('submit', handleLogin);
}

function validateLoginField(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  let error = null;

  if (fieldId === 'login-email') {
    if (!isNotEmpty(input.value)) error = 'El correo es obligatorio.';
    else if (!isValidEmail(input.value)) error = 'Ingresa un correo válido.';
  } else if (fieldId === 'login-password') {
    if (!isNotEmpty(input.value)) error = 'La contraseña es obligatoria.';
  }

  errorEl.textContent = error || '';
  input.classList.toggle('form-input--error', Boolean(error));
  return !error;
}

function validateAll() {
  return ['login-email', 'login-password']
    .map(validateLoginField)
    .every(Boolean);
}

async function handleLogin(e) {
  e.preventDefault();

  if (!validateAll()) return;

  const submitBtn = document.getElementById('login-submit-btn');
  const feedback = document.getElementById('login-feedback');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';
  feedback.textContent = '';
  feedback.className = 'form-feedback';

  try {
    await login(email, password);
    // Login exitoso: redirige al panel
    window.location.href = '/admin.html';
  } catch (error) {
    console.error('Error de login:', error);

    // Traduce los códigos de error de Firebase a mensajes legibles
    const messages = {
      'auth/invalid-credential': 'Correo o contraseña incorrectos.',
      'auth/user-not-found': 'No existe una cuenta con ese correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    };

    feedback.textContent = messages[error.code] || 'Error al iniciar sesión. Intenta de nuevo.';
    feedback.classList.add('form-feedback--error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Iniciar sesión';
  }
}