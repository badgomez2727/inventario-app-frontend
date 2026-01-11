import React from "react";
import { Link } from "react-router-dom";
import { 
  FaMobileAlt, 
  FaFileInvoiceDollar, 
  FaHistory, 
  FaBolt, 
  FaCheckCircle, 
  FaChartBar,
  FaRocket
} from "react-icons/fa";

// Componente de Logo Estilizado
const Logo = () => (
  <div className="flex items-center gap-2">
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
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <Logo />
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-emerald-500 transition-colors">Funciones</a>
          <a href="#about" className="hover:text-emerald-500 transition-colors">Nosotros</a>
        </div>
        <Link 
          to="/login" 
          className="bg-gray-100 text-gray-900 font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition-all"
        >
          Entrar
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative flex flex-col items-center justify-center pt-20 pb-32 text-center px-6 overflow-hidden">
        {/* Decoración de fondo suave */}
        <div className="absolute top-0 -z-10 h-full w-full bg-white">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,252,216,0.4)] opacity-50 blur-[80px]"></div>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce">
          <FaRocket size={14} /> ¡Impulsa tu negocio hoy!
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-gray-900">
          Vende en <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
            segundos.
          </span>
        </h1>

        <p className="max-w-2xl text-xl md:text-2xl mb-12 text-gray-500 font-medium leading-relaxed">
          La plataforma ágil para administrar tu inventario, generar facturas y ver tus ganancias reales. 
          Diseñado para ser veloz en celular y potente en PC.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          
          <Link
            to="/register-company"
            className="bg-gray-900 text-white font-bold px-12 py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-emerald-500 hover:scale-105 transition-all text-xl"
          >
            Empezar Gratis
          </Link>
        </div>
      </header>

      {/* --- CARACTERÍSTICAS (GRID) --- */}
      <section id="features" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Todo bajo control</h2>
            <p className="text-gray-500 text-lg font-medium">Olvídate de las hojas de cálculo y los errores manuales.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FaMobileAlt className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Interfaz Móvil</h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                Vende y revisa tu stock mientras caminas por tu local. Una experiencia fluida en cualquier dispositivo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FaFileInvoiceDollar className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Facturación Ágil</h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                Genera recibos y facturas profesionales al instante. Tus clientes recibirán claridad y tú mantendrás el orden.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FaHistory className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Historial Total</h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                Sigue cada movimiento. ¿Quién vendió qué y cuándo? Todo el histórico de tu inventario en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN CARGA MASIVA (HIGHLIGHT) --- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[3.5rem] p-12 md:p-24 text-white flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
          <div className="flex-1 z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Sube miles de productos en un clic.
            </h2>
            <p className="text-gray-400 text-xl mb-10 leading-relaxed">
              Sabemos que tu tiempo vale. Con nuestra herramienta de carga masiva, pasas tu inventario de Excel a **Vendita** en menos de lo que dura un café.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FaCheckCircle className="text-emerald-400" /> <span className="font-medium text-lg">Importación masiva ágil</span>
              </div>
              <div className="flex items-center gap-4">
                <FaCheckCircle className="text-emerald-400" /> <span className="font-medium text-lg">Categorización inteligente</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative z-10 bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl rotate-2">
            <FaChartBar className="text-6xl text-emerald-400 mb-6" />
            <h4 className="text-2xl font-bold mb-2">Analítica en Tiempo Real</h4>
            <p className="text-gray-400">Mira cómo crecen tus ganancias día a día con gráficas que cualquiera puede entender.</p>
          </div>
        </div>
      </section>

      {/* --- SOBRE VENDITA --- */}
      <section id="about" className="py-24 px-6 text-center max-w-3xl mx-auto">
        <div className="inline-block p-3 bg-emerald-50 rounded-2xl mb-6 text-emerald-600">
           <FaBolt size={30} />
        </div>
        <h3 className="text-4xl font-black mb-8 text-gray-900">Sobre Vendita</h3>
        <p className="text-xl text-gray-500 leading-relaxed italic">
          "Vendita nació de la necesidad de digitalizar el comercio local sin complicaciones. 
          No somos una herramienta pesada y antigua; somos la evolución del punto de venta: 
          **Claro, ágil y hecho para el mundo moderno.**"
        </p>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo />
          <p className="text-gray-400 font-medium">
            © {new Date().getFullYear()} Vendita Labs. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-gray-400 text-xl">
            {/* Aquí puedes poner links a redes sociales si quieres */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;