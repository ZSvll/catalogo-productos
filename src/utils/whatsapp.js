// Utilidad centralizada para generar links de WhatsApp en toda la app.
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

/**
 * Genera un link de WhatsApp con mensaje pre-escrito.
 * @param {string} message - texto que aparecerá ya escrito en el chat
 */
export function buildWhatsAppLink(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}