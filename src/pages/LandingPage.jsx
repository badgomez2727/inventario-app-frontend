// venta_inventario_app/frontend/src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import { FaBoxes, FaChartLine, FaUsers, FaLaptopCode } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Sección principal */}
      <header className="hero-section">
        <h1>Organiza tu Negocio, Multiplica tus Ganancias.</h1>
        <p>
          Gestiona tu inventario, clientes y ventas de forma eficiente con nuestra plataforma.
          Todo en un solo lugar, accesible desde cualquier dispositivo.
        </p>
        <Link to="/login" className="cta-button">
          Comienza Ahora
        </Link>
      </header>

      {/* Sección de características */}
      <section className="features-section">
        <h2>Características Clave</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaBoxes className="feature-icon" />
            <h3>Gestión de Inventario</h3>
            <p>Controla tus productos, stock y proveedores en tiempo real.</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Reportes y Análisis</h3>
            <p>Visualiza tus ventas mensuales y el valor de tu inventario.</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Clientes y Proveedores</h3>
            <p>Mantén un registro organizado de todos tus contactos.</p>
          </div>
        </div>
      </section>

      {/* Sección de "Sobre el Autor" (para nuevos proyectos) */}
      <section className="about-me-section">
        <div className="about-me-content">
          <FaLaptopCode className="about-me-icon" />
          <h3>¿Buscas un desarrollador para tu próximo proyecto?</h3>
          <p>
            Esta aplicación es un ejemplo de mi trabajo. Estoy disponible para colaborar en nuevas ideas y soluciones tecnológicas.
            Visita mi portafolio para ver más proyectos.
          </p>
          <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="about-me-link">
            Mi Portafolio
          </a>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
