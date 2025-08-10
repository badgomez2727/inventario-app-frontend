// venta_inventario_app/frontend/src/services/productService.js

// Usamos process.env.REACT_APP_API_URL para obtener la URL del backend
// que configuramos en frontend/.env.local
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Función para obtener todos los productos
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) { // Si la respuesta no es exitosa (ej. 404, 500)
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error; // Propaga el error para que el componente que llama pueda manejarlo
  }
};

// Función para crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indica que estamos enviando JSON
      },
      body: JSON.stringify(productData), // Convierte el objeto JS a JSON string
    });
    if (!response.ok) {
      // Si hay un error del servidor, intenta leer el mensaje de error del cuerpo de la respuesta
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP! Estado: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Aquí podrías añadir más funciones en el futuro, como updateProduct, deleteProduct, etc.