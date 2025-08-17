// venta_inventario_app/frontend/src/services/apiService.js

// Usa process.env.REACT_APP_API_URL para la URL base en producción,
// y 'http://localhost:3001' para desarrollo.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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

  const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
    ...options,
    headers,
  });

  // Manejo de error de autenticación (401)
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirige a la página de login
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

  // Si todo es OK, devuelve el JSON
  return response.json();
};

// --- Funciones de Autenticación ---
export const login = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
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
  const response = await fetch(`${BASE_URL}/auth/register-company-admin`, {
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
export const getSalesHistory = async () => {
  return authenticatedFetch('sales/history'); 
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

// --- Funciones de Reportes (ahora aceptan fechas opcionales) ---
export const getGeneralStats = async () => {
  return authenticatedFetch('reports/general-stats');
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

  const response = await fetch(`${BASE_URL}/api/receipts/${saleId}/pdf`, { 
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
