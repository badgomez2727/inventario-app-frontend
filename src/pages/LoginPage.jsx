// venta_inventario_app/frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importa el hook de autenticación

function LoginPage() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Obtiene la función de login del contexto
  const navigate = useNavigate(); // Hook para navegación programática

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(nombreUsuario, password); // Llama a la función de login del contexto

    if (result.success) {
      navigate('/productos'); // Redirige a la página de productos al iniciar sesión
    } else {
      setError(result.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
    setLoading(false);
  };

  return (
    <div className="form-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        ¿No tienes una cuenta? <Link to="/register-company">Registra tu compañía aquí</Link>
      </p>
    </div>
  );
}

export default LoginPage;