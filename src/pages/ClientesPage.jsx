import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../services/apiService';
import { FaEdit, FaTrashAlt, FaRocket } from 'react-icons/fa';

const ClientesPage = () => {
  // 1. Definición de todos los estados (Esto corrige los errores de 'no-undef')
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

  // 2. Cargar clientes al iniciar
  useEffect(() => { 
    fetchClients(); 
  }, []);

  // 3. Auto-ocultar mensajes de éxito (Mejora de UX)
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchClients = async () => {
    try { 
      setLoading(true); 
      setError(null); 
      const data = await getClients(); 
      setClientes(data); 
    } catch (err) { 
      console.error('Error al cargar clientes:', err); 
      setError(err.message || 'No se pudieron cargar los clientes.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(''); 
    setError('');
    try {
      if (editingClient) { 
        await updateClient(editingClient.id, formData); 
        setMessage('✅ Cliente actualizado con éxito.'); 
      } else { 
        await createClient(formData); 
        setMessage('🚀 Cliente creado con éxito.'); 
      }
      setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
      setEditingClient(null);
      fetchClients();
    } catch (err) { 
      setError(err.message || 'Error al guardar el cliente.'); 
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({ nombre: client.nombre, email: client.email || '', telefono: client.telefono || '', direccion: client.direccion || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    try { 
      await deleteClient(clientId); 
      setMessage('🗑️ Cliente eliminado.'); 
      fetchClients(); 
    } catch (err) { 
      setError(err.message || 'Error al eliminar el cliente.'); 
    }
  };

  const handleCancelEdit = () => { 
    setEditingClient(null); 
    setFormData({ nombre: '', email: '', telefono: '', direccion: '' }); 
  };

  if (loading) return <div className="p-10 text-center text-emerald-600 font-bold">Cargando clientes...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-black text-gray-800">
          Gestión de <span className="text-emerald-500">Clientes</span>
        </h2>
      </div>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-700">
          {editingClient ? '📝 Editar Cliente' : '👤 Nuevo Cliente'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-emerald-500 text-white font-bold py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
              {editingClient ? 'Actualizar' : 'Guardar Cliente'}
            </button>
            {editingClient && <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-gray-600 font-bold py-2 rounded-xl">Cancelar</button>}
          </div>
        </form>
        {message && <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-center font-medium animate-pulse">{message}</div>}
        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-center font-medium">{error}</div>}
      </div>

      {/* Tabla / Lista */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Lista de Clientes</h3>
          <span className="text-sm text-gray-400">{clientes.length} registrados</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clientes.map(client => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{client.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.email || 'Sin correo'}<br/>{client.telefono}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(client)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
                      <button onClick={() => handleDelete(client.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FaTrashAlt /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ESTA LÍNEA ES LA MÁS IMPORTANTE (Corrige el error de App.js)
export default ClientesPage;