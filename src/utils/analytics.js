// Medición de la campaña de anuncios (Meta Pixel). Sin REACT_APP_META_PIXEL_ID
// configurada no hace nada: ninguna llamada carga scripts ni envía datos.
//
// Privacidad: solo se inicia desde el panel/landing (nunca en el catálogo
// público, donde entran los clientes de cada negocio), con la configuración
// automática de Meta APAGADA (autoConfig=false: no lee botones ni campos de
// formularios) y sin mandar datos personales. Las páginas vistas se reportan
// solo en la landing y el registro (ver App.js); dentro del panel solo se
// envían eventos sueltos, sin URL con ids de clientes.

const PIXEL_ID = process.env.REACT_APP_META_PIXEL_ID;

export const pixelActivo = Boolean(PIXEL_ID);

let iniciado = false;

// Snippet oficial de Meta, con la variable local en vez de globales sueltas.
const cargarFbq = () => {
  if (window.fbq) return;
  const fbq = function () {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
};

const enviar = (...args) => {
  if (!PIXEL_ID || !iniciado) return;
  try {
    window.fbq(...args);
  } catch (e) {
    // Un bloqueador de anuncios puede romper fbq: la medición nunca debe romper la app.
  }
};

export const initPixel = () => {
  if (!PIXEL_ID || iniciado || typeof window === 'undefined') return;
  cargarFbq();
  iniciado = true;
  enviar('set', 'autoConfig', false, PIXEL_ID);
  enviar('init', PIXEL_ID);
};

export const trackPageView = () => enviar('track', 'PageView');

// Eventos estándar de Meta (ej. 'CompleteRegistration', 'Contact').
export const trackEvent = (nombre) => enviar('track', nombre);

// Eventos propios (ej. 'ProductoCreado', 'VentaRegistrada'): sirven para medir
// si quien se registró realmente empezó a usar la app.
export const trackCustom = (nombre) => enviar('trackCustom', nombre);
