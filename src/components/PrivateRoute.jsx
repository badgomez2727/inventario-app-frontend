// venta_inventario_app/frontend/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// El componente ahora acepta un prop 'requiredRole'
const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Muestra un mensaje de carga mientras se verifica la autenticación
  if (loading) {
    return <p>Cargando autenticación...</p>; 
  }

  // Si el usuario no está autenticado, lo redirige a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Usamos replace para no dejar la ruta protegida en el historial
  }
  
  // Condicional para verificar el rol.
  // super_admin_sistema es el rol más alto del sistema — nadie por encima de
  // él — así que también debe pasar cualquier chequeo de un rol inferior
  // como "admin_compania" (igual que ya lo trata el backend en
  // authMiddleware.js: authorizeAdmin acepta admin_compania Y super_admin_sistema).
  const hasRequiredRole =
    user?.rol === requiredRole || user?.rol === 'super_admin_sistema';

  if (requiredRole && (!user || !hasRequiredRole)) {
    console.warn(`Acceso denegado: El usuario ${user?.nombreUsuario} (Rol: ${user?.rol}) intentó acceder a una ruta que requiere el rol "${requiredRole}".`);
    // Redirige al dashboard si no tiene el rol. Podrías crear una página /acceso-denegado también.
    return <Navigate to="/dashboard" replace />;
  }

  // Si está autenticado y cumple con el rol requerido (si lo hay), permite el acceso
  return children;
};

export default PrivateRoute;
