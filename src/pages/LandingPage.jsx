// venta_inventario_app/frontend/src/pages/LandingPage.jsx

import React from "react";
import { Link } from "react-router-dom";
import { FaBoxes, FaChartLine, FaUsers, FaLaptopCode } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Organiza tu Negocio, Multiplica tus Ganancias.
        </h1>
        <p className="max-w-2xl text-lg md:text-xl mb-8">
          Gestiona tu inventario, clientes y ventas de forma eficiente con nuestra plataforma.  
          Todo en un solo lugar, accesible desde cualquier dispositivo.
        </p>
        <Link
          to="/login"
          className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Comienza Ahora
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Características Clave
        </h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="bg-gray-50 shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <FaBoxes className="text-indigo-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gestión de Inventario</h3>
            <p className="text-gray-600">
              Controla tus productos, stock y proveedores en tiempo real.
            </p>
          </div>
          <div className="bg-gray-50 shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <FaChartLine className="text-indigo-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reportes y Análisis</h3>
            <p className="text-gray-600">
              Visualiza tus ventas mensuales y el valor de tu inventario.
            </p>
          </div>
          <div className="bg-gray-50 shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <FaUsers className="text-indigo-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Clientes y Proveedores</h3>
            <p className="text-gray-600">
              Mantén un registro organizado de todos tus contactos.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <FaLaptopCode className="text-indigo-600 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            ¿Buscas un desarrollador para tu próximo proyecto?
          </h3>
          <p className="text-gray-700 mb-6">
            Esta aplicación es un ejemplo de mi trabajo. Estoy disponible para colaborar en nuevas ideas y soluciones tecnológicas.  
            Visita mi portafolio para ver más proyectos.
          </p>
          <a
            href="https://github.com/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Mi Portafolio
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
