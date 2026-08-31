import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaTachometerAlt, FaBox, FaHistory, FaShoppingCart,
  FaChartBar, FaUsers, FaTruck, FaUserCog,
  FaFileUpload, FaTimes, FaBars, FaBuilding, FaWhatsapp,
} from 'react-icons/fa';

const LogoVendita = ({ collapsed }) => (
  <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full transition-all`}>
    <div className="min-w-[40px] w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-2 flex-shrink-0">
      <span className="text-white font-black text-2xl -rotate-2">V</span>
    </div>
    {!collapsed && <span className="text-xl font-black tracking-tighter text-white whitespace-nowrap">Ven<span className="text-emerald-500">dita</span></span>}
  </div>
);

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const isAdmin = user && (user.rol === 'admin_compania' || user.rol === 'super_admin_sistema');
  const isSuperAdmin = user && user.rol === 'super_admin_sistema';
  const [collapsed, setCollapsed] = useState(false);

  const baseLink = 'flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group mx-2 mb-1';
  const activeLink = 'bg-emerald-500/10 text-emerald-500 font-bold';
  const inactiveLink = 'text-gray-400 hover:bg-gray-800 hover:text-gray-100';

  const menuLinks = [
    { to: '/productos', icon: <FaBox />, label: 'Inventario' },
    { to: '/ventas', icon: <FaShoppingCart />, label: 'Vender (POS)' },
    { to: '/pedido-whatsapp', icon: <FaWhatsapp />, label: 'Pedido WhatsApp' },
    { to: '/historial-ventas', icon: <FaChartBar />, label: 'Reporte Ventas' },
    { to: '/clientes', icon: <FaUsers />, label: 'Clientes' },
    { to: '/proveedores', icon: <FaTruck />, label: 'Proveedores' },
    { to: '/historial-stock', icon: <FaHistory />, label: 'Movimientos' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Panel Control' },
    { to: '/productos/upload', icon: <FaFileUpload />, label: 'Carga Masiva' },
    { to: '/gestion-usuarios', icon: <FaUserCog />, label: 'Configuración' },
  ];

  return (
    <>
      {/* 1. OVERLAY CORREGIDO: pointer-events-none es vital aquí */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-all duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* 2. NAVEGACIÓN CORREGIDA: Agregamos pointer-events-none cuando está cerrada */}
      <nav
        className={`fixed md:sticky top-0 left-0 h-screen bg-gray-900 border-r border-gray-800
                    transform transition-all duration-300 z-[70] flex flex-col shadow-2xl
                    ${isSidebarOpen 
                        ? 'translate-x-0 w-64' 
                        : '-translate-x-full md:translate-x-0 md:w-64 pointer-events-none md:pointer-events-auto'
                    } 
                    ${collapsed ? 'md:w-20' : 'md:w-64'} w-64 overflow-hidden`}
      >
        
        {/* Header */}
        <div className={`flex ${collapsed ? 'flex-col gap-4' : 'justify-between'} items-center px-4 py-6 flex-shrink-0 pointer-events-auto`}>
          <LogoVendita collapsed={collapsed} />
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-emerald-500 md:block hidden ml-2">
            <FaBars size={18} />
          </button>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-white md:hidden pointer-events-auto">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Links: Agregamos pointer-events-auto para que los links sí funcionen cuando el nav se ve */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2 pointer-events-auto">
          {isSuperAdmin && (
            <div className="mb-4">
              {!collapsed && <p className="px-6 text-[10px] font-black text-gray-600 uppercase mb-2">Sistema</p>}
              <ul>
                <li>
                  <NavLink to="/admin/companias" className={({ isActive }) => `${baseLink} ${collapsed ? 'justify-center px-0' : ''} ${isActive ? activeLink : inactiveLink}`} onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                    <span className="text-lg flex-shrink-0"><FaBuilding /></span>
                    {!collapsed && <span className="text-sm tracking-tight whitespace-nowrap">Compañías</span>}
                  </NavLink>
                </li>
              </ul>
            </div>
          )}

          {isAdmin && (
            <div className="mb-4">
              {!collapsed && <p className="px-6 text-[10px] font-black text-gray-600 uppercase mb-2">Admin</p>}
              <ul>
                {adminLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className={({ isActive }) => `${baseLink} ${collapsed ? 'justify-center px-0' : ''} ${isActive ? activeLink : inactiveLink}`} onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                      <span className="text-lg flex-shrink-0">{link.icon}</span>
                      {!collapsed && <span className="text-sm tracking-tight whitespace-nowrap">{link.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            {!collapsed && <p className="px-6 text-[10px] font-black text-gray-600 uppercase mb-2">Operaciones</p>}
            <ul>
              {menuLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={({ isActive }) => `${baseLink} ${collapsed ? 'justify-center px-0' : ''} ${isActive ? activeLink : inactiveLink}`} onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                    <span className="text-lg flex-shrink-0">{link.icon}</span>
                    {!collapsed && <span className="text-sm tracking-tight whitespace-nowrap">{link.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900 flex-shrink-0 pointer-events-auto">
          <div className={`bg-gray-800/40 rounded-2xl p-2 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.nombreUsuario?.substring(0, 2) || 'AD'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-white truncate">{user?.nombreUsuario || 'Admin'}</p>
                <p className="text-[9px] text-emerald-500 truncate uppercase tracking-tighter">{user?.rol?.split('_')[0]}</p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;