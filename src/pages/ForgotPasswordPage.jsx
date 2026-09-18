import React, { useState } from 'react';
import { forgotPassword } from '../services/apiService';
import '../styles/AuthPages.css';

// Componente Logo consistente
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

// Mensaje fijo del frontend, independiente de lo que devuelva el backend —
// el backend responde siempre 200 con un mensaje genérico (nunca revela si
// el correo existe), y acá lo completamos con instrucciones prácticas
// (revisar spam, confirmar que sea el correo correcto) sin comprometer esa
// ambigüedad intencional.
const MENSAJE_EXITO =
  'Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. ' +
  'Revisa tu bandeja de entrada y la carpeta de spam. Si no te llega en unos minutos, ' +
  'verifica que sea el mismo correo con el que te registraste.';

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
      // Ajuste: Enviamos solo el string del email
      await forgotPassword(email);
      // Mensaje fijo del frontend (ver MENSAJE_EXITO) — no dependemos del
      // texto que devuelva el backend, así el copy se puede mejorar acá sin
      // tocar el backend, y viceversa.
      setMessage(MENSAJE_EXITO);
    } catch (err) {
      // El backend nunca responde con un error distinto según si el correo
      // existe o no (siempre 200) — lo único que puede caer acá es un error
      // real (correo vacío, falla de red, error interno), no una pista sobre
      // si la cuenta existe.
      setError(err.message || 'Error al procesar la solicitud. Intenta de nuevo en unos minutos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo integrado aquí */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h2 className="auth-title">Recuperar Clave</h2>
        <p className="auth-subtitle">Ingresa tu correo y te enviaremos las instrucciones.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="auth-form-group">
            <label className="auth-label">Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        {message && <p className="message-success">{message}</p>}
        {error && <p className="message-error">{error}</p>}
        
        <div className="mt-8 text-center">
          <a href="/login" className="auth-link">Volver al Inicio</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;