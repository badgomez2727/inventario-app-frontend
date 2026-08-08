import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBuilding, FaUserShield, FaArrowLeft } from 'react-icons/fa';

// Componente de Logo (Consistente con la Landing)
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md transform rotate-2">
      <span className="text-white font-black text-xl -rotate-2">V</span>
    </div>
    <span className="text-xl font-black tracking-tighter text-gray-900">
      Ven<span className="text-emerald-500">dita</span>
    </span>
  </div>
);

function RegisterCompanyPage() {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

    if (!acceptedTerms) {
      setError('Debes aceptar los Términos y la Política de Tratamiento de Datos para continuar.');
      setLoading(false);
      return;
    }

    const companyData = { companyName, companyEmail, companyAddress, companyPhone };
    const userData = { username, email, password };

    const result = await registerCompanyAndAdmin(companyData, userData);

    if (result.success) {
      setMessage('¡Bienvenido a Vendita! Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2500);
    } else {
      setError(result.error || 'Error al registrar. Inténtalo de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Header con Logo y Volver */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
          <FaArrowLeft size={12} /> Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row">
        
        {/* Lado Izquierdo - Info Visual */}
        <div className="md:w-1/3 bg-emerald-600 p-10 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-black mb-6 leading-tight text-white">
            Estás a un paso de la agilidad.
          </h2>
          <p className="text-emerald-100 mb-8 font-medium">
            Al registrar tu empresa en Vendita, obtienes control total sobre tus ventas y stock desde el primer minuto.
          </p>
          <div className="space-y-4 text-sm opacity-80">
            <div className="flex items-center gap-3">
              <FaBuilding /> Configuración de negocio instantánea
            </div>
            <div className="flex items-center gap-3">
              <FaUserShield /> Panel de administración seguro
            </div>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="md:w-2/3 p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Sección Compañía */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                   <FaBuilding size={14}/>
                </div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">Datos de tu Negocio</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Nombre Comercial</label>
                  <input
                    type="text"
                    placeholder="Ej. Mi Tienda Moderna"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="mt-1 w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Corporativo</label>
                  <input
                    type="email"
                    placeholder="contacto@empresa.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                    className="mt-1 w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+57..."
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="mt-1 w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Sección Usuario Administrador */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                   <FaUserShield size={14}/>
                </div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">Cuenta de Administrador</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Tu Email Personal</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Confirmar</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Aceptación de Términos y Tratamiento de Datos */}
            <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald-500 flex-shrink-0"
              />
              <span>
                Acepto los{' '}
                <Link to="/terminos#terminos" target="_blank" className="text-emerald-600 font-bold hover:underline">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link to="/terminos#privacidad" target="_blank" className="text-emerald-600 font-bold hover:underline">
                  Política de Tratamiento de Datos
                </Link>
                .
              </span>
            </label>

            {/* Mensajes de Feedback */}
            {message && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold text-center">{message}</div>}
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold text-center">{error}</div>}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !acceptedTerms}
                className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Creando Universo Vendita...' : 'Crear mi Empresa'}
              </button>
              
              <p className="mt-8 text-center text-gray-500 font-medium">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-emerald-600 hover:underline font-bold">
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterCompanyPage;