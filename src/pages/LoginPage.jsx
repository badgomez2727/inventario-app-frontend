import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
      setError(result.error || "Error al iniciar sesión. Verifica tus credenciales.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
            >
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
          {error && (
            <p className="text-red-600 text-sm sm:text-base text-center font-medium mt-2">
              {error}
            </p>
          )}
        </form>
        <p className="mt-6 text-center text-sm sm:text-base text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register-company"
            className="text-indigo-600 font-medium hover:underline"
          >
            Registra tu compañía aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
