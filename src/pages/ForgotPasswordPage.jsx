// venta_inventario_app/frontend/src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { forgotPassword } from '../services/apiService';
import '../styles/AuthPages.css'; // Usaremos estilos compartidos para autenticación

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message || 'Se ha enviado un correo electrónico con instrucciones si tu cuenta está registrada.');
    } catch (err) {
      // El backend siempre devuelve 200 para esta ruta por seguridad,
      // pero si hubiera un error de red o otro tipo, lo capturamos aquí.
      setError(err.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>¿Olvidaste tu Contraseña?</h2>
        <p className="auth-description">Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
