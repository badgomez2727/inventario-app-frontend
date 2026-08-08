// venta_inventario_app/frontend/src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, registerCompanyAndAdmin as apiRegisterCompanyAndAdmin } from '../services/authService'; // Importa las funciones de authService

// Crea el contexto de autenticación
const AuthContext = createContext(null);

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Almacena info del user logueado
  const [token, setToken] = useState(null); // Almacena el token JWT
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga inicial
  const [, setMessage] = useState(null); // El valor no se consume aquí; RegisterCompanyPage maneja su propio mensaje local.

  // Efecto para cargar el token y usuario desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        logout(); // Limpiar si los datos están corruptos
      }
    }
    setLoading(false); // Ya terminó de cargar
  }, []);

  // Función de login
  const login = async (nombreUsuario, password) => {
    setLoading(true);
    try {
      const { token: receivedToken, user: userData } = await apiLogin(nombreUsuario, password);
      setToken(receivedToken);
      setUser(userData);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(userData)); // Almacena como string
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro de compañía y admin
  const registerCompanyAndAdmin = async (companyData, userData) => {
    setLoading(true);
    try {
      await apiRegisterCompanyAndAdmin(companyData, userData);
      setMessage("Registro exitoso. Ya puedes iniciar sesión.");
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };


  // Función de logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const authContextValue = {
    user,
    token,
    loading,
    isAuthenticated: !!token, // true si hay token, false si no
    login,
    logout,
    registerCompanyAndAdmin,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};