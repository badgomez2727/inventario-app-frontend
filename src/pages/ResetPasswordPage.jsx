// venta_inventario_app/frontend/src/pages/ResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/apiService';
import '../styles/AuthPages.css'; // Usaremos estilos compartidos para autenticación

function ResetPasswordPage() {
  const { token } = useParams(); // Obtiene el token de la URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Aquí puedes hacer una verificación inicial del token si fuera necesario
    // Pero por ahora, confiamos en la validación del backend al intentar resetear.
    if (!token) {
      setError('Token de restablecimiento no encontrado en la URL.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Token de restablecimiento inválido o faltante.');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, { password });
      setMessage(response.message || 'Contraseña restablecida con éxito.');
      setTimeout(() => {
        navigate('/login'); // Redirigir a login después de un éxito
      }, 3000); // 3 segundos antes de redirigir
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña. El token podría ser inválido o haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Restablecer Contraseña</h2>
        {token ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Nueva Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="auth-input"
                disabled={loading}
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        ) : (
          <p className="error-message">Token de restablecimiento no válido o faltante.</p>
        )}
        
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
