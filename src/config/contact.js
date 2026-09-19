// Contacto de Vendita (soporte, ventas y pagos), compartido por la landing y
// la página de apoyo/planes.
export const WHATSAPP_NUMBER = '573148520270'; // formato internacional, sin '+' ni espacios

export const whatsappLink = (mensaje) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
