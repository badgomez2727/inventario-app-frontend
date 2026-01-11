import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Header = ({ toggleSidebar, isMobile }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 flex justify-between items-center px-4 md:px-10 py-3">
      
      {/* Lado Izquierdo: Control de Menú (Solo visible si está autenticado) */}
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all md:hidden"
          >
            <FaBars size={20} />
          </button>
        )}
        
        {/* Identidad visual rápida para móvil */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-sm">V</div>
          <span className="font-black text-gray-900 tracking-tighter">Vendita</span>
        </div>
      </div>

      {/* Lado derecho: Perfil y Logout */}
      {isAuthenticated && (
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          
          {/* Info Usuario */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
            <FaUserCircle className="text-emerald-500 text-lg" />
            <span className="text-gray-700 font-bold text-sm">
              {user?.nombreUsuario}
            </span>
          </div>

          {/* Botón Salir */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Cerrar Sesión"
          >
            <span className="hidden md:inline">Salir</span>
            <FaSignOutAlt />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;