import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaRocket } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 mt-auto">
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Sección 1: Brand & Slogan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20">
              V
            </div>
            <h3 className="text-xl font-black text-white tracking-tighter">
              Ven<span className="text-emerald-500">dita</span>
            </h3>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Empoderando negocios locales con tecnología ágil para la gestión de inventarios y ventas en tiempo real.
          </p>
        </div>

        {/* Sección 2: Navegación Estratégica */}
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Plataforma</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><FaRocket className="text-[10px] text-emerald-500"/> Dashboard</a></li>
            <li><a href="#/productos" className="hover:text-emerald-400 transition-colors">Inventario</a></li>
            <li><a href="#/ventas" className="hover:text-emerald-400 transition-colors">Punto de Venta (POS)</a></li>
            <li><a href="#/reportes" className="hover:text-emerald-400 transition-colors text-gray-500 italic">Próximamente: Facturación Electrónica</a></li>
          </ul>
        </div>

        {/* Sección 3: Conectividad */}
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Comunidad</h3>
          <div className="flex space-x-5 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-all transform hover:-translate-y-1">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-all transform hover:-translate-y-1">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-all transform hover:-translate-y-1">
              <FaInstagram />
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            ¿Necesitas ayuda? <br />
            <span className="text-white font-bold italic">soporte@vendita.app</span>
          </p>
        </div>
      </div>

      {/* Parte inferior: Copyright & Credits */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>&copy; {currentYear} <strong>Vendita</strong>. Todos los derechos reservados.</p>
          <div className="flex gap-6 uppercase tracking-widest">
            <Link to="/terminos#terminos" className="hover:text-white transition">Términos</Link>
            <Link to="/terminos#privacidad" className="hover:text-white transition">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;