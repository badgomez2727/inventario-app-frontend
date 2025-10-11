// venta_inventario_app/frontend/src/pages/RegisterCompanyPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RegisterCompanyPage() {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { registerCompanyAndAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    const companyData = { companyName, companyEmail, companyAddress, companyPhone };
    const userData = { username, email, password };

    const result = await registerCompanyAndAdmin(companyData, userData);

    if (result.success) {
      setMessage('Compañía y usuario administrador registrados con éxito. Redirigiendo a login...');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.error || 'Error al registrar. Inténtalo de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Registrar Nueva Compañía y Administrador
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección Compañía */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">Datos de la Compañía</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre de la Compañía</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Email de Contacto</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Dirección</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sección Usuario */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">Datos del Usuario Administrador</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre de Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Mensajes */}
          {message && <p className="text-green-600 text-center text-sm">{message}</p>}
          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? 'Registrando...' : 'Registrar Compañía y Admin'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterCompanyPage;
