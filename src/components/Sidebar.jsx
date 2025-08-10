// venta_inventario_app/frontend/src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Sidebar.css';
import { FaTachometerAlt, FaBox, FaHistory, FaShoppingCart, FaChartBar, FaUsers, FaTruck, FaUserCog } from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen }) => {
  const { user } = useAuth();
  // Esta línea es crucial: define si el usuario es administrador
  // Solo los roles 'admin_compania' o 'super_admin_sistema' se consideran administradores
  const isAdmin = user && (user.rol === 'admin_compania' || user.rol === 'super_admin_sistema');

  return (
    <nav className={`sidebar-nav ${!isSidebarOpen ? 'collapsed' : ''}`}>
      <ul className="sidebar-menu">
        {/* Enlaces siempre visibles para usuarios autenticados */}
        <li>
          <NavLink to="/productos" className="sidebar-link" activeclassname="active">
            <FaBox className="sidebar-icon" /> <span className="sidebar-text">Productos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/historial-stock" className="sidebar-link" activeclassname="active">
            <FaHistory className="sidebar-icon" /> <span className="sidebar-text">Historial Stock</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/ventas" className="sidebar-link" activeclassname="active">
            <FaShoppingCart className="sidebar-icon" /> <span className="sidebar-text">Ventas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/historial-ventas" className="sidebar-link" activeclassname="active">
            <FaChartBar className="sidebar-icon" /> <span className="sidebar-text">Historial Ventas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/clientes" className="sidebar-link" activeclassname="active">
            <FaUsers className="sidebar-icon" /> <span className="sidebar-text">Clientes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/proveedores" className="sidebar-link" activeclassname="active">
            <FaTruck className="sidebar-icon" /> <span className="sidebar-text">Proveedores</span>
          </NavLink>
        </li>

        {/* Enlaces específicos para administradores: solo se renderizan si isAdmin es true */}
        {isAdmin && (
          <>
            <li>
              <NavLink to="/dashboard" className="sidebar-link" activeclassname="active">
                <FaTachometerAlt className="sidebar-icon" /> <span className="sidebar-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/reporte-inventario" className="sidebar-link" activeclassname="active">
                <FaChartBar className="sidebar-icon" /> <span className="sidebar-text">Reporte Inventario</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/gestion-usuarios" className="sidebar-link" activeclassname="active">
                <FaUserCog className="sidebar-icon" /> <span className="sidebar-text">Gestión de Usuarios</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
