import React from "react";
import { Link } from "react-router-dom";
import {
  FaBoxes, FaCashRegister, FaWallet, FaWhatsapp, FaStore, FaFileUpload,
  FaCheckCircle, FaRocket, FaBookOpen, FaLaptop, FaMobileAlt, FaChevronDown, FaRobot,
} from "react-icons/fa";
import { whatsappLink } from "../config/contact";
import { trackEvent, pixelActivo } from "../utils/analytics";

const MSG_INFO = "Hola, quiero información sobre Vendita.";
const MSG_AYUDA_CARGA = "Hola, quiero que me ayuden a cargar mis productos en Vendita.";

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

// Clases completas (no `bg-${color}-100`): Tailwind solo genera las que ve escritas.
const COLORES = {
  emerald: "bg-emerald-100 text-emerald-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
};

const FUNCIONES = [
  { icon: <FaBoxes />, color: "emerald", title: "Inventario claro", text: "Stock al día, alertas de poco stock y el historial de cada movimiento." },
  { icon: <FaCashRegister />, color: "blue", title: "Ventas en segundos", text: "Vende rápido desde el computador o el celular y entrega recibos en PDF." },
  { icon: <FaWallet />, color: "amber", title: "El fiado bajo control", text: "Ventas a crédito, abonos y una cartera por cliente con la antigüedad de cada deuda." },
  { icon: <FaWhatsapp />, color: "emerald", title: "Cobra sin incomodar", text: "Estado de cuenta en PDF y un recordatorio por WhatsApp, con un mensaje amable ya escrito." },
  { icon: <FaStore />, color: "purple", title: "Tu catálogo en línea", text: "Tu vitrina con fotos y precios. Tus clientes arman el pedido y te llega por WhatsApp." },
  { icon: <FaFileUpload />, color: "rose", title: "Tus productos desde Excel", text: "Sube tu inventario de una vez, con plantilla incluida. Si quieres, te ayudamos." },
];

const ANTES_DESPUES = [
  { antes: "Se pierden las cuentas del fiado", ahora: "Cada deuda con su cliente, sus abonos y su antigüedad" },
  { antes: "No sabes cuánto stock te queda", ahora: "Inventario al día y alertas cuando se está acabando" },
  { antes: "Los pedidos se enredan en el chat", ahora: "Un catálogo donde el cliente arma su pedido completo" },
];

const PASOS = [
  { n: 1, title: "Crea tu cuenta", text: "Toma un minuto, no necesitas tarjeta y pruebas 7 días gratis." },
  { n: 2, title: "Carga tus productos", text: "Desde Excel o uno a uno. Si quieres, te acompañamos en el arranque." },
  { n: 3, title: "Vende, cobra y recibe pedidos", text: "Desde el computador, el celular o la tablet." },
];

const INCLUYE = [
  "Todo Vendita durante 7 días, sin tarjeta",
  "Hasta 500 productos",
  "Ventas, inventario y recibos en PDF",
  "Fiado, cartera y estados de cuenta",
  "Catálogo en línea con pedidos por WhatsApp",
  "Asesoría inicial para cargar tus productos",
  "Tutoriales para aprender a usarla",
];

const PREGUNTAS = [
  { q: "¿Tengo que instalar algo?", a: "No. Vendita funciona desde el navegador de tu computador, celular o tablet (Windows, Mac, Android o iPhone). Solo necesitas internet." },
  { q: "¿Cuánto cuesta?", a: "Pruebas 7 días gratis con todo, sin tarjeta. Después eliges un plan: Básico a $10.000 al mes (hasta 150 productos) o Pro a $20.000 al mes (hasta 500 productos y asistente con IA). Pagas por Nequi, Daviplata o Bre-B." },
  { q: "¿Qué pasa cuando termina la prueba?", a: "Si no activas un plan, tu cuenta queda en modo solo lectura: puedes ver toda tu información, pero no modificarla. No perdemos nada de lo que cargaste, y cuando actives tu plan sigues donde quedaste." },
  { q: "¿Me ayudan a cargar mis productos?", a: "Sí. Te acompañamos en el arranque y tienes tutoriales. Escríbenos por WhatsApp y lo hacemos juntos." },
  { q: "Hoy llevo todo en un cuaderno o en Excel, ¿me sirve?", a: "Es justo para eso. Puedes subir tu Excel guardado como CSV o cargar tus productos uno a uno, y empezar a vender el mismo día." },
  { q: "¿Puedo tener empleados?", a: "Sí. Puedes crear usuarios con rol de administrador o de empleado." },
  { q: "¿Mis datos están seguros?", a: "Cada negocio ve únicamente su propia información, y las contraseñas se guardan cifradas." },
];

const BotonWhatsapp = ({ mensaje, children, className = "" }) => (
  <a
    href={whatsappLink(mensaje)}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackEvent("Contact")}
    className={`inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all active:scale-95 ${className}`}
  >
    <FaWhatsapp /> {children}
  </a>
);

const BotonRegistro = ({ className = "" }) => (
  <Link
    to="/register-company"
    className={`inline-flex items-center justify-center font-bold rounded-2xl shadow-xl transition-all active:scale-95 ${className}`}
  >
    Probar 7 días gratis
  </Link>
);

const LandingPage = () => {
  return (
    <div className="flex-1 w-full bg-white text-gray-900 overflow-x-hidden">

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full relative z-50">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#funciones" className="hover:text-emerald-500 transition-colors">Funciones</a>
          <a href="#como-funciona" className="hover:text-emerald-500 transition-colors">Cómo funciona</a>
          <a href="#lanzamiento" className="hover:text-emerald-500 transition-colors">Precios</a>
          <a href="#preguntas" className="hover:text-emerald-500 transition-colors">Preguntas</a>
        </div>
        <Link
          to="/login"
          className="bg-gray-100 text-gray-900 font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition-all active:scale-95"
        >
          Entrar
        </Link>
      </nav>

      {/* --- HERO --- */}
      <header className="relative flex flex-col items-center justify-center pt-10 pb-16 text-center px-6">
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-[100px]"></div>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
          <FaRocket size={14} /> Lanzamiento: 7 días gratis
        </div>

        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-tight max-w-4xl">
          Controla tu inventario y{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
            vende por WhatsApp.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-2xl mb-10 text-gray-500 font-medium">
          Para negocios que hoy llevan sus cuentas en un cuaderno, en Excel o en WhatsApp.
          Funciona en tu computador, celular o tablet, sin instalar nada.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <BotonRegistro className="bg-gray-900 text-white px-10 py-4 text-xl hover:bg-emerald-500" />
          <BotonWhatsapp mensaje={MSG_INFO} className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 text-lg hover:border-emerald-400">
            Hablar por WhatsApp
          </BotonWhatsapp>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-gray-500">
          <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Sin tarjeta</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Te ayudamos a cargar tus productos</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Funciona en cualquier dispositivo</li>
        </ul>
      </header>

      {/* --- DEL CUADERNO A VENDITA --- */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-8 tracking-tight">
            ¿Tu negocio vive en un cuaderno, en Excel o en el chat de WhatsApp?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {ANTES_DESPUES.map((item) => (
              <div key={item.antes} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <p className="text-rose-500 font-bold line-through decoration-2 mb-3">{item.antes}</p>
                <p className="text-gray-800 font-bold flex gap-2"><FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" /> {item.ahora}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FUNCIONES --- */}
      <section id="funciones" className="py-16 px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-3 tracking-tight">Todo lo que tu negocio necesita</h2>
          <p className="text-center text-gray-500 text-lg mb-10">Sin complicaciones y sin saber de computadores.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FUNCIONES.map((f) => (
              <div key={f.title} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-xl ${COLORES[f.color]}`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CÓMO FUNCIONA --- */}
      <section id="como-funciona" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-10 tracking-tight">Cómo funciona</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PASOS.map((p) => (
              <div key={p.n} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-900 text-white font-black text-2xl flex items-center justify-center">{p.n}</div>
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-gray-500">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 flex items-center justify-center gap-4 text-gray-400 text-2xl" aria-hidden="true">
            <FaLaptop /> <FaMobileAlt />
          </p>
        </div>
      </section>

      {/* --- CARGA DE PRODUCTOS --- */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-4">¿Ya tienes tus productos en Excel?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl">
            Descarga la plantilla, pega tus productos y súbelos de una vez. Y si prefieres, te ayudamos a cargarlos.
          </p>
          <div className="flex flex-col gap-3 mb-10">
            <div className="flex items-center gap-3"><FaCheckCircle className="text-emerald-400" /> <span>Carga masiva con plantilla incluida</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-emerald-400" /> <span>Asesoría inicial para arrancar</span></div>
            <div className="flex items-center gap-3"><FaBookOpen className="text-emerald-400" /> <span>Tutoriales paso a paso</span></div>
          </div>
          <BotonWhatsapp mensaje={MSG_AYUDA_CARGA} className="bg-emerald-500 text-white px-8 py-4 text-lg hover:bg-emerald-400">
            Quiero ayuda para cargar mis productos
          </BotonWhatsapp>
        </div>
      </section>

      {/* --- LANZAMIENTO --- */}
      <section id="lanzamiento" className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-[2.5rem] p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-sm">
            <FaRocket size={14} /> Oferta de lanzamiento
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Prueba Vendita 7 días gratis</h2>
          <ul className="text-left inline-block mb-6 space-y-3">
            {INCLUYE.map((item) => (
              <li key={item} className="flex items-start gap-3 font-medium text-gray-700">
                <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <div className="grid gap-3 sm:grid-cols-2 text-left mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Plan Básico</p>
              <p className="text-3xl font-black text-gray-900">$10.000 <span className="text-sm font-bold text-gray-400">al mes</span></p>
              <p className="text-sm text-gray-500 mt-1">Hasta 150 productos</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Plan Pro</p>
              <p className="text-3xl font-black text-gray-900">$20.000 <span className="text-sm font-bold text-gray-400">al mes</span></p>
              <p className="text-sm text-gray-500 mt-1">Hasta 500 productos y asistente con IA</p>
            </div>
          </div>
          <p className="text-gray-500 mb-8">
            Si no activas un plan al terminar la prueba, tu cuenta queda en solo lectura:
            puedes ver tu información y no perdemos nada de lo que cargaste.
          </p>
          <BotonRegistro className="bg-gray-900 text-white px-10 py-4 text-xl hover:bg-emerald-500" />
        </div>
      </section>

      {/* --- PRÓXIMAMENTE --- */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto bg-white border-2 border-dashed border-purple-200 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl flex-shrink-0"><FaRobot /></div>
          <div>
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">Próximamente</span>
            <h3 className="text-xl font-bold">Asistente con inteligencia artificial para generar tus productos</h3>
            <p className="text-gray-500">Para que tu catálogo esté listo en menos tiempo.</p>
          </div>
        </div>
      </section>

      {/* --- PREGUNTAS FRECUENTES --- */}
      <section id="preguntas" className="py-16 px-6 bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-8 tracking-tight">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {PREGUNTAS.map((item) => (
              <details key={item.q} className="group bg-white rounded-2xl border border-gray-100 shadow-sm">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-bold text-lg">
                  {item.q}
                  <FaChevronDown className="flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" size={14} />
                </summary>
                <p className="px-6 pb-5 text-gray-500 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- CIERRE --- */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Empieza hoy: 7 días gratis</h2>
        <p className="text-gray-500 text-lg mb-8">Crea tu cuenta en un minuto o escríbenos y te ayudamos a arrancar.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <BotonRegistro className="bg-gray-900 text-white px-10 py-4 text-xl hover:bg-emerald-500" />
          <BotonWhatsapp mensaje={MSG_INFO} className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 text-lg hover:border-emerald-400">
            Hablar por WhatsApp
          </BotonWhatsapp>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
            <Link to="/terminos" className="hover:text-emerald-500">Términos</Link>
            <Link to="/apoyar" className="hover:text-emerald-500">Apóyanos</Link>
            <Link to="/login" className="hover:text-emerald-500">Entrar</Link>
          </div>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Vendita Labs.</p>
        </div>
        {pixelActivo && (
          <p className="max-w-3xl mx-auto px-6 mt-6 text-center text-xs text-gray-400">
            Usamos el píxel de Meta para medir la efectividad de nuestros anuncios.
          </p>
        )}
      </footer>
    </div>
  );
};

export default LandingPage;
