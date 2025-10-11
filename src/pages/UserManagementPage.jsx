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

  useEffect(() => { fetchUsers(); }, []);

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setMessage(null);
    try {
      await createUser(form);
      setMessage('✅ Usuario creado con éxito.');
      setForm({ nombreUsuario: '', email: '', password: '', rol: '' });
      fetchUsers();
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setFormError(err.message || '❌ Error al crear el usuario.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Formulario */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center sm:text-left">Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Nombre de Usuario:</label>
            <input
              type="text"
              name="nombreUsuario"
              value={form.nombreUsuario}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Rol:</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Selecciona un rol --</option>
              <option value="ADMIN_COMPANIA">Administrador</option>
              <option value="OPERARIO">Operario</option>
              <option value="VENDEDOR">Vendedor</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Crear Usuario
            </button>
          </div>
        </form>
        {message && <p className="text-green-600 mt-3">{message}</p>}
        {formError && <p className="text-red-600 mt-3">{formError}</p>}
      </div>

      {/* Lista de usuarios: tabla desktop / cards mobile */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Usuarios de la Compañía</h2>
        {loading ? (
          <p className="text-gray-500">Cargando usuarios...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 border-b text-left">Nombre de Usuario</th>
                    <th className="p-3 border-b text-left">Email</th>
                    <th className="p-3 border-b text-left">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 border-b">{user.nombreUsuario}</td>
                      <td className="p-3 border-b">{user.email}</td>
                      <td className="p-3 border-b">{user.rol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                  <p><span className="font-semibold">Nombre de Usuario:</span> {user.nombreUsuario}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Rol:</span> {user.rol}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
