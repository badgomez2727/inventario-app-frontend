import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../services/apiService';
import { FaUserPlus, FaUsers } from 'react-icons/fa';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombreUsuario: '', email: '', password: '', rol: '' });
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  // Auto-ocultar mensajes
  useEffect(() => {
    if (message || formError) {
      const timer = setTimeout(() => { setMessage(null); setFormError(null); }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, formError]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
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
      setMessage('✅ Usuario creado correctamente en Vendita.');
      setForm({ nombreUsuario: '', email: '', password: '', rol: '' });
      fetchUsers();
    } catch (err) {
      setFormError(err.message || '❌ Error al crear el usuario.');
    }
  };

  // Mapeo de roles para vista amigable
  const roleDisplay = {
    'ADMIN_COMPANIA': { label: 'Administrador', color: 'bg-purple-100 text-purple-700' },
    'OPERARIO': { label: 'Operario', color: 'bg-blue-100 text-blue-700' },
    'VENDEDOR': { label: 'Vendedor', color: 'bg-emerald-100 text-emerald-700' }
  };

  if (loading) return <div className="p-10 text-center text-emerald-600 animate-pulse font-bold">Cargando sistema de usuarios...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Control de <span className="text-emerald-500">Accesos</span></h2>
          <p className="text-gray-500 text-sm">Gestiona quién tiene permiso para operar en tu negocio.</p>
          {error && <p className="text-red-500 text-sm font-medium mt-1">{error}</p>}
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <FaUsers className="text-emerald-500 text-xl" />
          <span className="font-bold text-gray-700">{users.length} Usuarios</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6">
              <FaUserPlus className="text-emerald-500" />
              <h3 className="font-bold text-gray-700 text-lg">Nuevo Integrante</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Usuario</label>
                <input type="text" name="nombreUsuario" value={form.nombreUsuario} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ej: dario_admin" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="correo@vendita.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Contraseña</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Rol de Acceso</label>
                <select name="rol" value={form.rol} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer">
                  <option value="">Seleccionar...</option>
                  <option value="ADMIN_COMPANIA">Administrador</option>
                  <option value="OPERARIO">Operario</option>
                  <option value="VENDEDOR">Vendedor</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20 mt-2">
                Registrar Usuario
              </button>
            </form>
            {message && <p className="text-emerald-600 text-sm mt-4 font-medium text-center">{message}</p>}
            {formError && <p className="text-red-500 text-sm mt-4 font-medium text-center">{formError}</p>}
          </div>
        </div>

        {/* Tabla Principal */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                          {user.nombreUsuario.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user.nombreUsuario}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${roleDisplay[user.rol]?.color || 'bg-gray-100'}`}>
                        {roleDisplay[user.rol]?.label || user.rol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;