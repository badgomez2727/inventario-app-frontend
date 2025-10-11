// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaTachometerAlt,
  FaBox,
  FaHistory,
  FaShoppingCart,
  FaChartBar,
  FaUsers,
  FaTruck,
  FaUserCog,
  FaFileUpload,
  FaTimes,
  FaBars,
} from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const isAdmin =
    user && (user.rol === 'admin_compania' || user.rol === 'super_admin_sistema');

  const [collapsed, setCollapsed] = useState(false);

  const baseLink =
    'flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors relative group';
  const activeLink = 'bg-gray-800 text-white font-semibold';

  return (
    <>
      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity md:hidden ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <nav
  className={`fixed md:static top-0 left-0 h-screen md:h-auto bg-gray-900 text-gray-300 
    transform transition-all duration-300 z-50 flex flex-col
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    ${collapsed ? 'w-20' : 'w-64'}`}
>

        {/* Logo */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <div className="flex items-center">
            {!collapsed && (
              <svg
                width="160"
                height="40"
                viewBox="0 0 620 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0" y="0" width="320" height="100" rx="24" fill="#fff" />
                <path
                  d="M36 70 Q42 90 60 80 Q70 78 72 70 Q74 62 64 62 Q56 62 54 70 Q52 76 36 70"
                  fill="#22c55e"
                  opacity="0.9"
                />
                <circle cx="54" cy="54" r="11" fill="#2563eb" />
                <rect x="48" y="65" width="12" height="20" rx="7" fill="#3b82f6" />
                <text
                  x="90"
                  y="62"
                  fontFamily="Montserrat, Arial, sans-serif"
                  fontSize="48"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  Acudero
                </text>
                <text
                  x="93"
                  y="85"
                  fontFamily="Montserrat, Arial, sans-serif"
                  fontSize="16"
                  fill="#22c55e"
                  fontWeight="600"
                >
                  Inventarios
                </text>
              </svg>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white transition md:block hidden"
            >
              <FaBars size={20} />
            </button>
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white transition md:hidden"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Lista de enlaces */}
        <ul className="mt-4 space-y-1">
          {[ // Enlaces comunes
            { to: '/productos', icon: <FaBox />, label: 'Productos' },
            { to: '/historial-stock', icon: <FaHistory />, label: 'Historial Stock' },
            { to: '/ventas', icon: <FaShoppingCart />, label: 'Ventas' },
            { to: '/historial-ventas', icon: <FaChartBar />, label: 'Historial Ventas' },
            { to: '/clientes', icon: <FaUsers />, label: 'Clientes' },
            { to: '/proveedores', icon: <FaTruck />, label: 'Proveedores' },
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : ''}`
                }
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar(); // 👈 solo cerrar en móvil
                }}
              >
                {link.icon}
                {!collapsed && <span>{link.label}</span>}

                {/* Tooltip cuando está colapsado */}
                {collapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm text-white rounded opacity-0 group-hover:opacity-100 transition">
                    {link.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}

          {isAdmin &&
            [
              { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
              { to: '/productos/upload', icon: <FaFileUpload />, label: 'Carga Masiva Productos' },
              { to: '/gestion-usuarios', icon: <FaUserCog />, label: 'Gestión de Usuarios' },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `${baseLink} ${isActive ? activeLink : ''}`
                  }
                  onClick={() => {
                    if (window.innerWidth < 768) toggleSidebar(); // 👈 también solo en móvil
                  }}
                >
                  {link.icon}
                  {!collapsed && <span>{link.label}</span>}

                  {/* Tooltip cuando está colapsado */}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm text-white rounded opacity-0 group-hover:opacity-100 transition">
                      {link.label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
