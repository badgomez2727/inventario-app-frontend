// frontend/src/components/Footer.jsx

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección 1 */}
        <div>
          <h3 className="text-lg font-semibold text-white">InventarioApp</h3>
          <p className="mt-2 text-sm">
            La solución para gestionar tu inventario y ventas de manera eficiente.
          </p>
        </div>

        {/* Sección 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white">Links Rápidos</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#/productos" className="hover:text-white transition">Productos</a></li>
            <li><a href="#/clientes" className="hover:text-white transition">Clientes</a></li>
            <li><a href="#/proveedores" className="hover:text-white transition">Proveedores</a></li>
          </ul>
        </div>

        {/* Sección 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white">Síguenos</h3>
          <div className="mt-2 flex space-x-4 text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Parte inferior */}
      <div className="bg-gray-800 text-center py-4 text-sm text-gray-400">
        <p>&copy; {currentYear} InventarioApp. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
