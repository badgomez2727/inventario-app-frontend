// venta_inventario_app/frontend/src/services/apiService.js

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

  const response = await fetch(`${BASE_URL}/api/${endpoint}`, { // Nota: aquí añadimos /api/
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Si el token es inválido o expirado, forzar logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirige a login
    throw new Error('Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Error en la petición a ${endpoint}`);
  }

  return response.json();
};

// Funciones específicas para productos usando authenticatedFetch
export const getProducts = async () => {
  return authenticatedFetch('productos'); // Llama a /api/productos
};

export const createProduct = async (productData) => {
  return authenticatedFetch('productos', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const addStockEntry = async (data) => {
  return authenticatedFetch('stock/in', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Nueva función para registrar una salida de stock
export const addStockExit = async (data) => {
  return authenticatedFetch('stock/out', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getStockMovementsHistory = async () => {
  return authenticatedFetch('stock'); // Llama a la ruta /api/stock
};

// Nueva función para obtener la lista de usuarios de la compañía
export const getUsers = async () => {
  return authenticatedFetch('users'); // Llama a la ruta /api/users
};

// Nueva función para crear un nuevo usuario
export const createUser = async (userData) => {
  return authenticatedFetch('users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getSales = async () => {
  return authenticatedFetch('sales');
};

// Nueva función para crear una nueva venta
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


// --- Funciones para Proveedores ---
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





// Puedes añadir más funciones aquí para actualizar, eliminar, etc.
// export const updateProduct = async (id, productData) => { ... }
// export const deleteProduct = async (id) => { ... }