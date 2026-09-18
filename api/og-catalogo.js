// Vercel Serverless Function — sirve un HTML mínimo con metadatos Open
// Graph para crawlers de redes sociales (WhatsApp, Facebook, etc.) que
// piden /catalogo/:slug. Los visitantes humanos nunca llegan acá: el
// rewrite en vercel.json solo redirige cuando el User-Agent es un bot
// conocido — esta función no reemplaza la SPA, solo le da a esos bots algo
// que sepan leer (no ejecutan JavaScript, así que la app real no les sirve).
//
// REACT_APP_API_URL ya está configurada como variable de entorno del
// proyecto en Vercel (se usa también para el bundle del cliente) — Vercel
// expone las variables de entorno del proyecto a las funciones serverless
// igual, sin importar el prefijo REACT_APP_ (ese prefijo solo le importa a
// Create React App al armar el bundle del navegador).
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  const slug = req.query.slug;
  if (!slug) {
    res.status(400).send('Falta el parámetro slug.');
    return;
  }

  let catalogo = null;
  try {
    const response = await fetch(`${BACKEND_URL}/public/catalogo/${encodeURIComponent(slug)}`);
    if (response.ok) {
      catalogo = await response.json();
    }
  } catch (err) {
    // Si el backend no responde, igual servimos metadatos genéricos — mejor
    // eso que un error crudo en la vista previa del link compartido.
    console.error('og-catalogo: no se pudo consultar el catálogo público', err);
  }

  const nombre = catalogo?.company?.nombre || 'Vendita';
  const descripcion = catalogo?.company?.descripcionCatalogo || 'Catálogo en línea hecho con Vendita.';
  const imagen = catalogo?.company?.fotoPortadaCatalogo || `https://${req.headers.host}/logo512.png`;
  const url = `https://${req.headers.host}/catalogo/${slug}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(nombre)}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(nombre)}" />
  <meta property="og:description" content="${escapeHtml(descripcion)}" />
  <meta property="og:image" content="${escapeHtml(imagen)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <p>${escapeHtml(nombre)} — ${escapeHtml(descripcion)}</p>
</body>
</html>`);
};
