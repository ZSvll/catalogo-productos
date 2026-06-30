import { setPageMeta } from '../utils/seo.js';

export function initPrivacyPage(containerSelector) {
  setPageMeta({
    title: 'Política de Privacidad',
    description: 'Cómo recopilamos, usamos y protegemos tu información personal.',
  });

  const main = document.querySelector(containerSelector);
  const lastUpdated = new Intl.DateTimeFormat('es-DO', { dateStyle: 'long' }).format(new Date());

  main.innerHTML = `
    <section class="container static-page">
      <h1 class="section-title">Política de Privacidad</h1>
      <p class="static-updated">Última actualización: ${lastUpdated}</p>

      <div class="static-content">
        <h2>1. Información que recopilamos</h2>
        <p>
          Recopilamos la información que nos proporcionas directamente al usar el formulario
          de contacto (nombre, correo electrónico y mensaje) o al iniciar sesión como
          administrador del sitio.
        </p>

        <h2>2. Uso de la información</h2>
        <p>
          Utilizamos tu información únicamente para responder tus consultas y gestionar el
          catálogo de productos. No vendemos ni compartimos tu información con terceros con
          fines comerciales.
        </p>

        <h2>3. Almacenamiento de datos</h2>
        <p>
          Los datos de productos y cuentas de administrador se almacenan de forma segura en
          Firebase (Google Cloud). Las imágenes se almacenan en Cloudinary.
        </p>

        <h2>4. Cookies y almacenamiento local</h2>
        <p>
          Usamos el almacenamiento local de tu navegador (localStorage) únicamente para
          recordar tu preferencia de modo claro/oscuro. No utilizamos cookies de rastreo
          publicitario.
        </p>

        <h2>5. Tus derechos</h2>
        <p>
          Puedes solicitar la eliminación de tus datos de contacto en cualquier momento
          escribiéndonos por WhatsApp o correo electrónico.
        </p>
      </div>
    </section>
  `;
}