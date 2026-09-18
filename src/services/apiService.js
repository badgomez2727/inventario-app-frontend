// venta_inventario_app/frontend/src/services/apiService.js

// Usa process.env.REACT_APP_API_URL para la URL base en producción,
// y 'http://localhost:3001' para desarrollo.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Backend (Render free) y base de datos (Neon free) se "duermen" tras un
// rato sin uso — la primera petición después de eso puede tardar 20-40s en
// vez de los ~200ms normales. Si una petición se demora más de este umbral,
// avisamos a <ColdStartOverlay> (vía evento global) para que el usuario vea
// un mensaje de "despertando el servidor" en vez de pensar que algo se dañó.
const COLD_START_THRESHOLD_MS = 2500;

const fetchWithColdStartNotice = async (url, options) => {
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    window.dispatchEvent(new CustomEvent('vendita:coldstart', { detail: true }));
  }, COLD_START_THRESHOLD_MS);

  try {
    return await fetch(url, options);
  } finally {
    clearTimeout(timer);
    if (timedOut) {
      window.dispatchEvent(new CustomEvent('vendita:coldstart', { detail: false }));
    }
  }
};

// Cuando el token expira o es inválido (401), forzamos vuelta al login —
// pero window.location.href navega de inmediato y desmonta el componente
// actual antes de que pueda mostrar el throw de abajo, así que sin esto el
// usuario simplemente "desaparece" de vuelta al login sin ninguna
// explicación (se ve como una desconexión random, no como una sesión
// vencida). Guardamos el mensaje en sessionStorage para que LoginPage lo
// lea y lo muestre después de la navegación.
export const SESSION_EXPIRED_KEY = 'vendita:sessionExpiredMessage';
const redirectToLoginBySessionExpired = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  try {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, 'Tu sesión expiró. Por favor, inicia sesión de nuevo.');
  } catch (e) {
    // sessionStorage puede fallar en navegación privada; no bloquea el redirect.
  }
  window.location.href = '/login';
};

// Función genérica para hacer peticiones autenticadas
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token'); // Obtiene el token del localStorage

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescribir o añadir otros headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Añade el token al encabezado
  }

  const response = await fetchWithColdStartNotice(`${BASE_URL}/api/${endpoint}`, {
    ...options,
    headers,
  });

  // Manejo de error de autenticación (401)
  if (response.status === 401) {
    redirectToLoginBySessionExpired();
    throw new Error('Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.');
  }

  // Manejo de respuestas 207 (Multi-Status) del backend para carga masiva
  if (response.status === 207) {
    const data = await response.json();
    // Lanzar un error pero con los datos de éxito/error parcial para que se manejen en el UI
    const customError = new Error(JSON.stringify(data));
    customError.isMultiStatus = true; // Flag para identificar este tipo de error
    throw customError;
  }

  // Si la respuesta no es OK y no es 207, intenta leer el mensaje de error del backend
  if (!response.ok) {
    let errorData = { error: `Error en la petición a ${endpoint}` };
    try {
      errorData = await response.json(); // Intenta parsear si la respuesta es JSON
    } catch (e) {
      // Si no es JSON, usa el estado HTTP y el texto crudo
      errorData.error = `Error ${response.status}: ${response.statusText || 'Error desconocido'}.`;
    }
    throw new Error(errorData.error || 'Error desconocido en la respuesta del servidor.');
  }

  // 204 No Content no trae body — response.json() revienta con "Unexpected
  // end of JSON input" si se llama igual (ej. DELETE /productos/:id, que ya
  // respondía 204 desde antes de esto).
  if (response.status === 204) {
    return null;
  }

  // Si todo es OK, devuelve el JSON
  return response.json();
};

// --- Funciones de Autenticación ---
export const login = async (credentials) => {
  const response = await fetchWithColdStartNotice(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en el inicio de sesión.');
  }
  return response.json();
};

export const registerCompanyAndAdmin = async (data) => {
  const response = await fetchWithColdStartNotice(`${BASE_URL}/auth/register-company-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al registrar compañía y admin.');
  }
  return response.json();
};




export const getProducts = async (page = 1, limit = 10) => {
  // Aseguramos que siempre vayan números
  const p = page || 1;
  const l = limit || 10;
  return authenticatedFetch(`productos?page=${p}&limit=${l}`);
};


export const createProduct = async (productData) => {
  return authenticatedFetch('productos', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (productId, productData) => {
  return authenticatedFetch(`productos/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return authenticatedFetch(`productos/${id}`, {
    method: 'DELETE',
  });
};

// --- Fotos de producto (Cloudinary) ---
// La subida es en dos pasos: 1) el backend firma (nunca ve el binario),
// 2) el navegador sube el archivo directo a Cloudinary con esa firma, y
// 3) registramos la URL resultante en nuestra base. uploadProductImage hace
// los tres pasos de una — es lo único que necesita llamar el componente.

const getProductImageUploadSignature = async (productId) => {
  return authenticatedFetch(`productos/${productId}/imagenes/firma`, { method: 'POST' });
};

export const addProductImage = async (productId, { url, publicId }) => {
  return authenticatedFetch(`productos/${productId}/imagenes`, {
    method: 'POST',
    body: JSON.stringify({ url, publicId }),
  });
};

export const uploadProductImage = async (productId, file) => {
  const { signature, timestamp, apiKey, cloudName, folder } = await getProductImageUploadSignature(productId);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', timestamp);
  form.append('signature', signature);
  form.append('folder', folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!uploadRes.ok) {
    const detalle = await uploadRes.json().catch(() => null);
    throw new Error(detalle?.error?.message || 'No se pudo subir la imagen a Cloudinary.');
  }
  const subida = await uploadRes.json();

  return addProductImage(productId, { url: subida.secure_url, publicId: subida.public_id });
};

export const deleteProductImage = async (productId, imageId) => {
  return authenticatedFetch(`productos/${productId}/imagenes/${imageId}`, { method: 'DELETE' });
};

export const reorderProductImages = async (productId, ids) => {
  return authenticatedFetch(`productos/${productId}/imagenes/orden`, {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  });
};

// Historial de cambios de un producto (precios, stock manual, etc.), más reciente primero
export const getProductHistory = async (id) => {
  return authenticatedFetch(`productos/${id}/history`);
};

export const uploadProducts = async (productsDataArray) => {
  // `authenticatedFetch` ahora maneja el 207 Multi-Status, así que podemos llamarlo directamente
  try {
    const data = await authenticatedFetch('productos/upload-csv', { 
      method: 'POST',
      body: JSON.stringify(productsDataArray),
    });
    return data; // Si la carga es 200 OK, devuelve los datos
  } catch (error) {
    // Si authenticatedFetch lanza un error con isMultiStatus, lo re-lanzamos para que se maneje
    if (error.isMultiStatus) {
      const data = JSON.parse(error.message); // Parseamos el mensaje de error de vuelta a JSON
      return data; // Devolvemos los datos de éxito/error parcial
    }
    throw error; // Re-lanza cualquier otro error
  }
};


// --- Funciones de Stock ---
export const addStockEntry = async (data) => {
  return authenticatedFetch('stock/add', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const addStockExit = async (data) => {
  return authenticatedFetch('stock/remove', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ¡CORREGIDO! Ahora llama a 'stock/history'
export const getStockMovementsHistory = async () => {
  return authenticatedFetch('stock/history'); 
};

// --- Funciones de Usuarios ---
export const getUsers = async () => {
  return authenticatedFetch('users');
};

export const createUser = async (userData) => {
  return authenticatedFetch('users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (userId, userData) => {
  return authenticatedFetch(`users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const setUserActivo = async (userId, activo) => {
  return authenticatedFetch(`users/${userId}/activo`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
};

// --- Funciones de Ventas ---
export const getSales = async () => {
  return authenticatedFetch('sales');
};

export const createSale = async (saleData) => {
  return authenticatedFetch('sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  });
};

// Función para obtener el historial de ventas
export const getSalesHistory = async (page = 1, limit = 10) => {
  const p = page || 1;
  const l = limit || 10;
  return authenticatedFetch(`sales/history?page=${p}&limit=${l}`);
};

// --- Pagos/abonos de una venta ---
export const getSalePayments = async (saleId) => {
  return authenticatedFetch(`sales/${saleId}/payments`);
};

export const registerSalePayment = async (saleId, paymentData) => {
  return authenticatedFetch(`sales/${saleId}/payments`, {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
};

export const voidSalePayment = async (saleId, paymentId, motivo) => {
  return authenticatedFetch(`sales/${saleId}/payments/${paymentId}/anular`, {
    method: 'PATCH',
    body: JSON.stringify({ motivo }),
  });
};

// Anula la venta completa (no un pago individual): solo admin_compania,
// motivo obligatorio, y solo si la venta no tiene pagos activos.
export const voidSale = async (saleId, motivo) => {
  return authenticatedFetch(`sales/${saleId}/anular`, {
    method: 'PATCH',
    body: JSON.stringify({ motivo }),
  });
};

// Asigna/cambia el cliente de una venta existente. `payload` es
// { clientId } o { clienteNuevo: { nombre, telefono } }.
export const assignClienteToSale = async (saleId, payload) => {
  return authenticatedFetch(`sales/${saleId}/cliente`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};


// --- Pedido por WhatsApp asistido por IA (función PRO) ---
export const parseWhatsappOrder = async (texto) => {
  return authenticatedFetch('pedidos-ia/parse', {
    method: 'POST',
    body: JSON.stringify({ texto }),
  });
};

// --- Funciones de Clientes ---
export const getClients = async (page = 1, limit = 10) => {
  const p = page || 1;
  const l = limit || 10;
  return authenticatedFetch(`clientes?page=${p}&limit=${l}`);
};

export const createClient = async (clientData) => {
  return authenticatedFetch('clientes', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
};

export const updateClient = async (clientId, clientData) => {
  return authenticatedFetch(`clientes/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
};

export const deleteClient = async (clientId) => {
  return authenticatedFetch(`clientes/${clientId}`, {
    method: 'DELETE',
  });
};

export const setClientActivo = async (clientId, activo) => {
  return authenticatedFetch(`clientes/${clientId}/activo`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
};

// Cartera: clientes con al menos una venta PENDIENTE/PARCIAL activa, con su
// saldo adeudado y la antigüedad de cada una.
export const getCartera = async () => {
  return authenticatedFetch('clientes/cartera');
};

// --- Funciones de Proveedores ---
export const getSuppliers = async (page = 1, limit = 10) => {
  const p = page || 1;
  const l = limit || 10;
  return authenticatedFetch(`proveedores?page=${p}&limit=${l}`);
};

export const createSupplier = async (supplierData) => {
  return authenticatedFetch('proveedores', {
    method: 'POST',
    body: JSON.stringify(supplierData),
  });
};

export const updateSupplier = async (supplierId, supplierData) => {
  return authenticatedFetch(`proveedores/${supplierId}`, {
    method: 'PUT',
    body: JSON.stringify(supplierData),
  });
};

export const deleteSupplier = async (supplierId) => {
  return authenticatedFetch(`proveedores/${supplierId}`, {
    method: 'DELETE',
  });
};

// --- Funciones de Reportes (ahora aceptan fechas opcionales) ---
export const getGeneralStats = async () => {
  return authenticatedFetch('reports/general-stats');
};

// Uso actual de la compañía vs los límites de su plan (FREE/PRO)
export const getPlanStatus = async () => {
  return authenticatedFetch('reports/plan-status');
};

// --- Funciones de Admin (solo super_admin_sistema) ---
export const getAdminCompanies = async (page = 1, limit = 20) => {
  return authenticatedFetch(`admin/companies?page=${page}&limit=${limit}`);
};

export const updateCompanyPlan = async (companyId, plan) => {
  return authenticatedFetch(`admin/companies/${companyId}/plan`, {
    method: 'PATCH',
    body: JSON.stringify({ plan }),
  });
};

export const updateCompanyActivo = async (companyId, activo) => {
  return authenticatedFetch(`admin/companies/${companyId}/activo`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
};

export const getInventoryValue = async () => {
  return authenticatedFetch('reports/inventory-value');
};

// Modificada para aceptar startDate y endDate
export const getMonthlySales = async (startDate = null, endDate = null) => {
  let queryString = '';
  if (startDate && endDate) {
    queryString = `?startDate=${startDate}&endDate=${endDate}`;
  }
  return authenticatedFetch(`reports/monthly-sales${queryString}`);
};

// Modificada para aceptar startDate y endDate
export const getTopSellingProducts = async (startDate = null, endDate = null) => {
  let queryString = '';
  if (startDate && endDate) {
    queryString = `?startDate=${startDate}&endDate=${endDate}`;
  }
  return authenticatedFetch(`reports/top-selling-products${queryString}`);
};


// --- Función para obtener Recibo PDF ---
export const getSaleReceiptPdf = async (saleId) => {
  const token = localStorage.getItem('token');
  const headers = {}; // Iniciamos headers vacíos

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetchWithColdStartNotice(`${BASE_URL}/api/receipts/${saleId}/pdf`, { 
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      redirectToLoginBySessionExpired();
      throw new Error('Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.');
    }

    let errorMessage = `Error al generar el recibo para la venta ${saleId}.`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido'} al generar el recibo.`;
    }
    throw new Error(errorMessage);
  }

  return response.blob();
};

// En frontend/src/services/apiService.js

// Al final de tu archivo apiService.js, reemplaza la función resetPassword por esta:

export const resetPassword = async (token, data) => {
  const response = await fetchWithColdStartNotice(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: token,
      newPassword: data.password // Coincide con tu backend
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al restablecer la contraseña.');
  }

  return response.json();
};

export const forgotPassword = async (email) => {
  const response = await fetchWithColdStartNotice(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al solicitar recuperación.');
  }

  return response.json();
};