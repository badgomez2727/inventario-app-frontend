import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, setUserActivo } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { FaUserPlus, FaUsers, FaEdit, FaBan, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { ASSIGNABLE_ROLES, ROLE_DISPLAY } from '../constants/roles';
import PasswordInput from '../components/PasswordInput';

const EMPTY_FORM = { nombreUsuario: '', email: '', password: '', rol: '' };

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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

  const handleEditClick = (targetUser) => {
    setEditingUser(targetUser);
    setForm({ nombreUsuario: targetUser.nombreUsuario, email: targetUser.email, password: '', rol: targetUser.rol });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setMessage(null);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { nombreUsuario: form.nombreUsuario, email: form.email, rol: form.rol });
        setMessage('✅ Usuario actualizado correctamente.');
        setEditingUser(null);
      } else {
        await createUser(form);
        setMessage('✅ Usuario creado correctamente en Vendita.');
      }
      setForm(EMPTY_FORM);
      fetchUsers();
    } catch (err) {
      setFormError(err.message || (editingUser ? '❌ Error al actualizar el usuario.' : '❌ Error al crear el usuario.'));
    }
  };

  const handleToggleActivo = async (targetUser) => {
    const accion = targetUser.activo ? 'desactivar' : 'reactivar';
    const confirmMsg = targetUser.activo
      ? `¿Desactivar a "${targetUser.nombreUsuario}"? No va a poder iniciar sesión hasta que lo reactives.`
      : `¿Reactivar a "${targetUser.nombreUsuario}"?`;
    if (!window.confirm(confirmMsg)) return;

    setTogglingId(targetUser.id);
    setError(null);
    try {
      await setUserActivo(targetUser.id, !targetUser.activo);
      setMessage(`✅ ${targetUser.nombreUsuario} fue ${targetUser.activo ? 'desactivado' : 'reactivado'}.`);
      fetchUsers();
    } catch (err) {
      setError(err.message || `No se pudo ${accion} el usuario.`);
    } finally {
      setTogglingId(null);
    }
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaUserPlus className="text-emerald-500" />
                <h3 className="font-bold text-gray-700 text-lg">{editingUser ? 'Editar Integrante' : 'Nuevo Integrante'}</h3>
              </div>
              {editingUser && (
                <button type="button" onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              )}
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
              {!editingUser && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Contraseña</label>
                  <PasswordInput name="password" value={form.password} onChange={handleChange} required autoComplete="new-password" className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="••••••••" />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Rol de Acceso</label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  required
                  disabled={editingUser && editingUser.id === currentUser?.id && editingUser.rol === 'admin_compania'}
                  className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccionar...</option>
                  {ASSIGNABLE_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {editingUser && editingUser.id === currentUser?.id && editingUser.rol === 'admin_compania' && (
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">No puedes quitarte a ti mismo el rol de administrador.</p>
                )}
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20 mt-2">
                {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
              </button>
            </form>
            {message && <p className="text-emerald-600 text-sm mt-4 font-medium text-center">{message}</p>}
            {formError && <p className="text-red-500 text-sm mt-4 font-medium text-center">{formError}</p>}
          </div>
        </div>

        {/* Tabla Principal */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Acceso</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => {
                    const esUnoMismo = user.id === currentUser?.id;
                    return (
                    <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${!user.activo ? 'opacity-60' : ''}`}>
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
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${ROLE_DISPLAY[user.rol]?.color || 'bg-gray-100'}`}>
                          {ROLE_DISPLAY[user.rol]?.label || user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.activo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                            <FaCheckCircle /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-600">
                            <FaBan /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {user.rol !== 'super_admin_sistema' && (
                            <button
                              onClick={() => handleEditClick(user)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                          )}
                          {user.rol !== 'super_admin_sistema' && !esUnoMismo && (
                            <button
                              onClick={() => handleToggleActivo(user)}
                              disabled={togglingId === user.id}
                              title={user.activo ? 'Desactivar' : 'Reactivar'}
                              className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${
                                user.activo ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {user.activo ? <FaBan /> : <FaCheckCircle />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;