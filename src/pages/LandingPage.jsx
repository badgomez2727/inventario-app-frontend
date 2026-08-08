import React from "react";
import { Link } from "react-router-dom";
import { 
  FaMobileAlt, FaFileInvoiceDollar, FaHistory, 
  FaBolt, FaCheckCircle, FaChartBar, FaRocket
} from "react-icons/fa";

const Logo = () => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-2">
      <span className="text-white font-black text-2xl -rotate-2">V</span>
    </div>
    <span className="text-2xl font-black tracking-tighter text-gray-900">
      Ven<span className="text-emerald-500">dita</span>
    </span>
  </div>
);

const LandingPage = () => {
  return (
    <div className="flex-1 w-full bg-white text-gray-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full relative z-50">
        <Logo />
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-emerald-500 transition-colors">Funciones</a>
          <a href="#about" className="hover:text-emerald-500 transition-colors">Nosotros</a>
          <Link to="/apoyar" className="hover:text-emerald-500 transition-colors">Apóyanos</Link>
        </div>
        <Link 
          to="/login" 
          className="bg-gray-100 text-gray-900 font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition-all active:scale-95"
        >
          Entrar
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative flex flex-col items-center justify-center pt-12 pb-20 text-center px-6">
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-[100px]"></div>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
          <FaRocket size={14} /> ¡Impulsa tu negocio hoy!
        </div>

        <h1 className="text-4xl md:text-8xl font-black mb-6 tracking-tighter leading-tight">
          Vende en <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
            segundos.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-2xl mb-10 text-gray-500 font-medium">
          Administra tu inventario y genera facturas de forma ágil.
        </p>

        <Link
          to="/register-company"
          className="w-full sm:w-auto bg-gray-900 text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:bg-emerald-500 transition-all text-xl active:scale-95"
        >
          Empezar Gratis
        </Link>
      </header>

      {/* --- FEATURES --- */}
      <section id="features" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          <FeatureCard icon={<FaMobileAlt />} title="Interfaz Móvil" color="emerald" text="Vende y revisa tu stock desde cualquier lugar." />
          <FeatureCard icon={<FaFileInvoiceDollar />} title="Facturación Ágil" color="blue" text="Genera recibos profesionales al instante." />
          <FeatureCard icon={<FaHistory />} title="Historial Total" color="purple" text="Sigue cada movimiento de tus productos." />
        </div>
      </section>

      {/* --- Carga Masiva --- */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[2.5rem] p-8 md:p-20 text-white">
          <h2 className="text-3xl md:text-6xl font-black mb-6">Sube miles de productos en un clic.</h2>
          <p className="text-gray-400 text-lg mb-8">Importa tu inventario desde Excel en segundos.</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3"><FaCheckCircle className="text-emerald-400" /> <span>Importación masiva ágil</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-emerald-400" /> <span>Categorización inteligente</span></div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Vendita Labs.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, text, color }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
    <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center mb-6 text-${color}-600 text-xl`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{text}</p>
  </div>
);

export default LandingPage;