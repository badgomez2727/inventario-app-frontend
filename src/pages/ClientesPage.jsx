import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../services/apiService';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try { setLoading(true); setError(null); const data = await getClients(); setClientes(data); }
    catch (err) { console.error('Error al cargar clientes:', err); setError(err.message || 'No se pudieron cargar los clientes.'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(''); setError('');
    try {
      if (editingClient) { await updateClient(editingClient.id, formData); setMessage('Cliente actualizado con éxito.'); }
      else { await createClient(formData); setMessage('Cliente creado con éxito.'); }
      setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
      setEditingClient(null);
      fetchClients();
    } catch (err) { console.error('Error al guardar cliente:', err); setError(err.message || 'Error al guardar el cliente.'); }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({ nombre: client.nombre, email: client.email || '', telefono: client.telefono || '', direccion: client.direccion || '' });
    setMessage(''); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    setMessage(''); setError('');
    try { await deleteClient(clientId); setMessage('Cliente eliminado con éxito.'); fetchClients(); }
    catch (err) { console.error('Error al eliminar cliente:', err); setError(err.message || 'Error al eliminar el cliente.'); }
  };

  const handleCancelEdit = () => { setEditingClient(null); setFormData({ nombre: '', email: '', telefono: '', direccion: '' }); setMessage(''); setError(''); };

  if (loading) return <p className="text-gray-600">Cargando clientes...</p>;
  if (error) return <p className="text-red-500 font-medium">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Gestión de Clientes</h2>

      {/* Formulario */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-xl md:text-2xl font-semibold mb-4">{editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-gray-700 font-medium mb-1">Nombre:</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300" />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-gray-700 font-medium mb-1">Teléfono:</label>
              <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300" />
            </div>
            <div>
              <label htmlFor="direccion" className="block text-gray-700 font-medium mb-1">Dirección:</label>
              <textarea id="direccion" name="direccion" value={formData.direccion} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">{editingClient ? 'Actualizar Cliente' : 'Crear Cliente'}</button>
            {editingClient && <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">Cancelar</button>}
          </div>
        </form>
        {message && <p className="text-green-600 mt-3">{message}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Lista: tabla en desktop, cards en móvil */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl md:text-2xl font-semibold mb-4">Lista de Clientes</h3>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[600px] border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Dirección</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(client => (
                <tr key={client.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{client.id}</td>
                  <td className="p-3">{client.nombre}</td>
                  <td className="p-3">{client.email || 'N/A'}</td>
                  <td className="p-3">{client.telefono || 'N/A'}</td>
                  <td className="p-3">{client.direccion || 'N/A'}</td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-800" title="Editar"><FaEdit /></button>
                    <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-800" title="Eliminar"><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {clientes.map(client => (
            <div key={client.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
              <p><span className="font-semibold">ID:</span> {client.id}</p>
              <p><span className="font-semibold">Nombre:</span> {client.nombre}</p>
              <p><span className="font-semibold">Email:</span> {client.email || 'N/A'}</p>
              <p><span className="font-semibold">Teléfono:</span> {client.telefono || 'N/A'}</p>
              <p><span className="font-semibold">Dirección:</span> {client.direccion || 'N/A'}</p>
              <div className="flex justify-end gap-3 mt-2">
                <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-800"><FaTrashAlt /></button>
              </div>
            </div>
          ))}
        </div>

        {clientes.length === 0 && <p className="text-gray-600">No hay clientes registrados.</p>}
      </div>
    </div>
  );
};

export default ClientesPage;
