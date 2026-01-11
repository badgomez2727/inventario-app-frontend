import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaArrowLeft, FaLock, FaUser } from "react-icons/fa";

// Logo consistente
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

function LoginPage() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(nombreUsuario, password);

    if (result.success) {
      navigate("/productos");
    } else {
      setError(result.error || "Credenciales incorrectas. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      
      {/* Botón flotante para volver al inicio */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors">
          <FaArrowLeft size={12} /> Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Cabecera del Login */}
        <div className="flex flex-col items-center mb-10">
          <Logo />
          <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight text-center">
            Bienvenido de nuevo
          </h2>
          <p className="text-gray-500 font-medium mt-2">Gestiona tu negocio con agilidad</p>
        </div>

        {/* Card del Formulario */}
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Usuario */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">
                Nombre de Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FaUser size={14} />
                </span>
                <input
                  type="text"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  required
                  autoFocus
                  placeholder="Tu usuario"
                  className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FaLock size={14} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <Link 
                to="/forgot-password" 
                className="text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Manejo de Errores */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            {/* Botón de Acción */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none text-lg"
            >
              {loading ? "Verificando..." : "Ingresar a Vendita"}
            </button>
          </form>
        </div>

        {/* Link a Registro */}
        <p className="mt-10 text-center text-gray-500 font-medium">
          ¿Aún no tienes Vendita?{" "}
          <Link
            to="/register-company"
            className="text-emerald-600 font-black hover:underline underline-offset-4"
          >
            Crea tu empresa aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;