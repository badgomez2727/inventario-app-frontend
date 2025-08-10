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
      setTimeout(() => navigate('/login'), 3000); // Redirige después de 3 segundos
    } else {
      setError(result.error || 'Error al registrar. Inténtalo de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Registrar Nueva Compañía y Administrador</h2>
      <form onSubmit={handleSubmit}>
        <h3>Datos de la Compañía</h3>
        <div>
          <label>Nombre de la Compañía:</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>
        <div>
          <label>Email de Contacto de la Compañía:</label>
          <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required />
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
        </div>

        <h3 style={{ marginTop: '30px' }}>Datos del Usuario Administrador</h3>
        <div>
          <label>Nombre de Usuario (para login):</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email del Usuario:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Compañía y Admin'}
        </button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
}

export default RegisterCompanyPage;