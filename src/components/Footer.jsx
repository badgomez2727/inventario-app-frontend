// frontend/src/components/Footer.jsx

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>InventarioApp</h3>
          <p>La solución para gestionar tu inventario y ventas de manera eficiente.</p>
        </div>
        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul>
            <li><a href="#/productos">Productos</a></li>
            <li><a href="#/clientes">Clientes</a></li>
            <li><a href="#/proveedores">Proveedores</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} InventarioApp. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;