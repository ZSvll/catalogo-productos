import { setPageMeta } from '../utils/seo.js';

const faqData = [
  {
    question: '¿Cuánto tiempo tarda el envío?',
    answer: 'Los envíos a Santo Domingo tardan de 1 a 2 días hábiles. Al interior del país, de 3 a 5 días hábiles.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos transferencias bancarias, pagos en efectivo en entrega y próximamente tarjetas de crédito/débito en línea.',
  },
  {
    question: '¿Puedo devolver un producto?',
    answer: 'Sí, tienes 7 días desde la entrega para solicitar una devolución, siempre que el producto esté sin usar y en su empaque original.',
  },
  {
    question: '¿Tienen tienda física?',
    answer: 'Por el momento operamos exclusivamente en línea, pero puedes contactarnos por WhatsApp para coordinar la entrega.',
  },
  {
    question: '¿Cómo sé si un producto está disponible?',
    answer: 'Cada producto en el catálogo muestra su stock disponible. Si dice "Sin stock", ese producto no está disponible temporalmente.',
  },
];

export function initFaqPage(containerSelector) {
  setPageMeta({
    title: 'Preguntas Frecuentes',
    description: 'Respuestas a las preguntas más comunes sobre envíos, pagos, devoluciones y más.',
  });

  const main = document.querySelector(containerSelector);

 const itemsHTML = faqData
  .map(
    (item) => `
    <details class="faq-item">
      <summary class="faq-question">
        ${item.question}
        <i class="fa-solid fa-chevron-down faq-icon"></i>
      </summary>
      <p class="faq-answer">${item.answer}</p>
    </details>`
  )
  .join('');

  main.innerHTML = `
    <section class="container static-page">
      <h1 class="section-title">Preguntas Frecuentes</h1>
      <div class="faq-list">
        ${itemsHTML}
      </div>
    </section>
  `;
}