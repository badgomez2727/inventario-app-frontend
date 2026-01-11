import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { resetPassword } from '../services/apiService';
import '../styles/AuthPages.css';

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

function ResetPasswordPage() {
  const [searchParams] = useSearchParams(); 
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await resetPassword(token, { password });
      setMessage(response.message || 'Contraseña restablecida con éxito.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h2 className="auth-title">Nueva Contraseña</h2>
        <p className="auth-subtitle">Define tu nueva clave de acceso.</p>

        {token ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="auth-form-group">
              <label className="auth-label">Nueva Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                placeholder="••••••••"
              />
            </div>
            <div className="auth-form-group">
              <label className="auth-label">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                required
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Restableciendo..." : "Actualizar Contraseña"}
            </button>
          </form>
        ) : (
          <p className="message-error">Token inválido o expirado.</p>
        )}
        
        {message && <p className="message-success">{message}</p>}
        {error && <p className="message-error">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPasswordPage;