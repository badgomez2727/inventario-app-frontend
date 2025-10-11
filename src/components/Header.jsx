import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar, isMobile }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-40 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
      {/* Botón menú móvil */}
      {isAuthenticated && (
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition sm:hidden"
        >
          <FaBars className="text-xl text-gray-700" />
        </button>
      )}

      {/* Lado derecho */}
      {isAuthenticated && (
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-gray-700 font-medium">
            Hola, {user?.nombreUsuario}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
