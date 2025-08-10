// venta_inventario_app/frontend/src/services/authService.js

// Correcto: Apunta a la base del backend sin '/api' final
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const login = async (nombreUsuario, password) => {
  try {
    // La URL final será por ejemplo: http://localhost:3001/auth/login
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombreUsuario, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del backend en login:', errorData); // Para depurar
      throw new Error(errorData.error || 'Error desconocido en el login.');
    }

    const data = await response.json();
    console.log('Respuesta exitosa del login:', data); // Para depurar
    return data; // Debe contener token y user
  } catch (error) {
    console.error('Error en el servicio de login (frontend):', error);
    throw error;
  }
};

export const registerCompanyAndAdmin = async (companyData, userData) => {
  try {
    // La URL final será por ejemplo: http://localhost:3001/auth/register-company
    const response = await fetch(`${BASE_URL}/auth/register-company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...companyData, ...userData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del backend en registro:', errorData); // Para depurar
      throw new Error(errorData.error || 'Error desconocido al registrar compañía y administrador.');
    }

    const data = await response.json();
    console.log('Respuesta exitosa del registro:', data); // Para depurar
    return data;
  } catch (error) {
    console.error('Error en el servicio de registro (frontend):', error);
    throw error;
  }
};