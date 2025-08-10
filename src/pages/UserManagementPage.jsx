// venta_inventario_app/frontend/src/pages/UserManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../services/apiService';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nombreUsuario: '',
    email: '',
    password: '',
    rol: '',
  });
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError(err.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setMessage(null);
    try {
      await createUser(form);
      setMessage('Usuario creado con éxito.');
      setForm({
        nombreUsuario: '',
        email: '',
        password: '',
        rol: '',
      });
      fetchUsers(); // Refresca la lista de usuarios
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setFormError(err.message || 'Error al crear el usuario.');
    }
  };

  return (
    <div className="main-content">
      <div className="form-container">
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              name="nombreUsuario"
              value={form.nombreUsuario}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Rol:</label>
            <select
              className="form-select"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona un rol --</option>
              <option value="ADMIN_COMPANIA">Administrador</option>
              <option value="OPERARIO">Operario</option>
              <option value="VENDEDOR">Vendedor</option>
            </select>
          </div>
          <button type="submit">Crear Usuario</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {formError && <p className="error-message">{formError}</p>}
      </div>

      <hr style={{ margin: '30px 0' }} />

      <div className="list-container">
        <h2>Usuarios de la Compañía</h2>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : users.length === 0 ? (
          <p>No hay otros usuarios registrados en esta compañía.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre de Usuario</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombreUsuario}</td>
                  <td>{user.email}</td>
                  <td>{user.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;