// venta_inventario_app/frontend/src/services/apiService.js

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Función genérica para hacer peticiones autenticadas que esperan JSON
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token'); // Obtiene el token del localStorage

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescribir o añadir otros headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Añade el token al encabezado
  }

  const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Error en la petición a ${endpoint}`);
  }

  return response.json();
};

// --- Funciones de Productos ---
export const getProducts = async () => {
  return authenticatedFetch('productos');
};

export const createProduct = async (productData) => {
  return authenticatedFetch('productos', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const uploadProducts = async (productsDataArray) => {
  return authenticatedFetch('productos/upload-csv', { // Nueva ruta en el backend
    method: 'POST',
    body: JSON.stringify(productsDataArray),
  });
};

export const addStockEntry = async (data) => {
  return authenticatedFetch('stock/in', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const addStockExit = async (data) => {
  return authenticatedFetch('stock/out', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getStockMovementsHistory = async () => {
  return authenticatedFetch('stock');
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

// --- Funciones de Ventas ---
export const getSales = async () => {
  // Esta es para obtener ventas individuales por ID, si tienes esa ruta
  return authenticatedFetch('sales');
};

export const getSalesHistory = async () => {
  // Esta es la función para el historial de ventas que necesitas en SalesHistoryPage
  return authenticatedFetch('sales/history'); 
};

export const createSale = async (saleData) => {
  return authenticatedFetch('sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
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

export const getInventoryValue = async () => {
  return authenticatedFetch('reports/inventory-value');
};

export const getMonthlySales = async () => {
  return authenticatedFetch('reports/monthly-sales');
};

// --- Funciones de Clientes ---
export const getClients = async () => {
  return authenticatedFetch('clientes');
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

// --- Funciones de Proveedores ---
export const getSuppliers = async () => {
  return authenticatedFetch('proveedores');
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

export const getGeneralStats = async () => {
  return authenticatedFetch('reports/general-stats');
};

export const getTopSellingProducts = async () => {
  return authenticatedFetch('reports/top-selling-products');
};

// --- Función para obtener Recibo PDF (¡NUEVA Y CORREGIDA!) ---
// No usa authenticatedFetch directamente porque el tipo de retorno es Blob, no JSON.
export const getSaleReceiptPdf = async (saleId) => {
  const token = localStorage.getItem('token');
  const headers = {}; // Iniciamos headers vacíos

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/receipts/${saleId}/pdf`, { // Usa /api/receipts/${saleId}/pdf
    headers,
  });

  if (!response.ok) {
    // Manejo de error de autenticación (401)
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.');
    }

    // Intentar leer el error del cuerpo de la respuesta,
    // asegurando que saleId esté disponible para el mensaje de error.
    let errorMessage = `Error al generar el recibo para la venta ${saleId}.`; // saleId en scope aquí
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // Si no se puede parsear como JSON, usar el estado HTTP o el texto crudo
      errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido'} al generar el recibo.`;
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta es OK, devuelve el Blob del PDF
  return response.blob();
};
