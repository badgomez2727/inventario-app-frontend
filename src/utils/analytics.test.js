// REACT_APP_META_PIXEL_ID se lee al cargar el módulo, así que cada prueba lo
// carga de nuevo (isolateModules) con la variable que necesita.

const cargarAnalytics = (pixelId) => {
  if (pixelId === undefined) delete process.env.REACT_APP_META_PIXEL_ID;
  else process.env.REACT_APP_META_PIXEL_ID = pixelId;
  let modulo;
  jest.isolateModules(() => {
    modulo = require('./analytics');
  });
  return modulo;
};

describe('analytics (Meta Pixel)', () => {
  afterEach(() => {
    delete window.fbq;
    delete window._fbq;
    document.head.innerHTML = '';
    delete process.env.REACT_APP_META_PIXEL_ID;
  });

  test('sin REACT_APP_META_PIXEL_ID no hace nada: ni script ni fbq', () => {
    const a = cargarAnalytics(undefined);
    a.initPixel();
    a.trackPageView();
    a.trackEvent('Contact');
    a.trackCustom('ProductoCreado');

    expect(a.pixelActivo).toBe(false);
    expect(window.fbq).toBeUndefined();
    expect(document.querySelectorAll('script').length).toBe(0);
  });

  test('con el ID: inicia con la configuración automática APAGADA y encola los eventos', () => {
    const a = cargarAnalytics('12345');
    a.initPixel();
    a.initPixel(); // iniciar dos veces no duplica nada
    a.trackPageView();
    a.trackEvent('CompleteRegistration');
    a.trackCustom('VentaRegistrada');

    expect(a.pixelActivo).toBe(true);
    expect(window.fbq.queue.map((args) => Array.from(args))).toEqual([
      ['set', 'autoConfig', false, '12345'],
      ['init', '12345'],
      ['track', 'PageView'],
      ['track', 'CompleteRegistration'],
      ['trackCustom', 'VentaRegistrada'],
    ]);
    expect(document.querySelectorAll('script[src*="fbevents.js"]').length).toBe(1);
  });

  test('los eventos anteriores a iniciar el píxel se ignoran', () => {
    const a = cargarAnalytics('12345');
    a.trackEvent('Contact');
    expect(window.fbq).toBeUndefined();
  });

  test('si fbq falla (ej. un bloqueador de anuncios) la app no se rompe', () => {
    const a = cargarAnalytics('12345');
    a.initPixel();
    window.fbq = () => {
      throw new Error('bloqueado');
    };
    expect(() => a.trackEvent('Contact')).not.toThrow();
    expect(() => a.trackCustom('ProductoCreado')).not.toThrow();
  });
});
