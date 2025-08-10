// venta_inventario_app/frontend/src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';
import { FaBars } from 'react-icons/fa'; // Importamos el icono

const Header = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="main-header">
      <div className="header-left">
        {isAuthenticated && (
          // Botón para alternar el sidebar
          <button onClick={toggleSidebar} className="toggle-sidebar-button">
            <FaBars />
          </button>
        )}
        {/* Logo SVG dentro de un Link */}
        <Link to="/" className="header-logo-link">
          <svg width="250" height="70" viewBox="0 0 620 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="320" height="100" rx="24" fill="#fff" />
            <path d="M36 70 Q42 90 60 80 Q70 78 72 70 Q74 62 64 62 Q56 62 54 70 Q52 76 36 70"
                fill="#22c55e" opacity="0.9"/>
            <circle cx="54" cy="54" r="11" fill="#2563eb" />
            <rect x="48" y="65" width="12" height="20" rx="7" fill="#3b82f6"/>
            <text x="90" y="62" font-family="Montserrat, Arial, sans-serif" font-size="54" font-weight="bold" fill="#2563eb">
              Acudero
            </text>
            <text x="93" y="85" font-family="Montserrat, Arial, sans-serif" font-size="18" fill="#22c55e" font-weight="600">
              Inventarios
            </text>
          </svg>
        </Link>
      </div>
      {isAuthenticated && (
        <div className="header-right">
          <span className="user-greeting">Hola, {user?.nombreUsuario}</span>
          <button onClick={logout} className="logout-button">Cerrar Sesión</button>
        </div>
      )}
    </header>
  );
};

export default Header;
