// venta_inventario_app/frontend/src/components/BottomNavbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa';

const BottomNavbar = () => {
  const { user } = useAuth();
  // Los valores reales de rol son minúsculas (ver constants/roles.js) — esta
  // comparación estaba en mayúsculas y nunca coincidía con ningún usuario
  // real, así que ningún admin veía "Usuarios" en el menú móvil.
  const isAdmin = user && (user.rol === 'admin_compania' || user.rol === 'super_admin_sistema');

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden z-50">
      <div className="flex justify-around">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center p-2 text-gray-600 ${isActive ? 'text-blue-600' : ''}`
          }
        >
          <FaTachometerAlt size={20} />
          <span className="text-xs">Dashboard</span>
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) =>
            `flex flex-col items-center p-2 text-gray-600 ${isActive ? 'text-blue-600' : ''}`
          }
        >
          <FaBox size={20} />
          <span className="text-xs">Productos</span>
        </NavLink>

        <NavLink
          to="/ventas"
          className={({ isActive }) =>
            `flex flex-col items-center p-2 text-gray-600 ${isActive ? 'text-blue-600' : ''}`
          }
        >
          <FaShoppingCart size={20} />
          <span className="text-xs">Ventas</span>
        </NavLink>

        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `flex flex-col items-center p-2 text-gray-600 ${isActive ? 'text-blue-600' : ''}`
          }
        >
          <FaUsers size={20} />
          <span className="text-xs">Clientes</span>
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/gestion-usuarios"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 text-gray-600 ${isActive ? 'text-blue-600' : ''}`
            }
          >
            <FaUsers size={20} />
            <span className="text-xs">Usuarios</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNavbar;
