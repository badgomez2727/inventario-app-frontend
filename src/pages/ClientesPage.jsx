// venta_inventario_app/frontend/src/pages/ClientesPage.jsx

import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../services/apiService'; // <-- Ruta corregida
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../styles/ClientesPage.css'; // <-- Ruta corregida

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editingClient, setEditingClient] = useState(null); // Cliente que se está editando
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
        setMessage('Cliente actualizado con éxito.');
      } else {
        await createClient(formData);
        setMessage('Cliente creado con éxito.');
      }
      setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
      setEditingClient(null);
      fetchClients(); // Refrescar la lista
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      setError(err.message || 'Error al guardar el cliente.');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      nombre: client.nombre,
      email: client.email || '',
      telefono: client.telefono || '',
      direccion: client.direccion || ''
    });
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplazarse al formulario
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setMessage('');
      setError('');
      try {
        await deleteClient(clientId);
        setMessage('Cliente eliminado con éxito.');
        fetchClients(); // Refrescar la lista
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
        setError(err.message || 'Error al eliminar el cliente.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
    setMessage('');
    setError('');
  };

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="clientes-list-container">
      <h2>Gestión de Clientes</h2>

      <div className="client-form-section"> {/* Usamos la clase CSS aquí */}
        <h3>{editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="direccion">Dirección:</label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit">{editingClient ? 'Actualizar Cliente' : 'Crear Cliente'}</button>
          {editingClient && (
            <button type="button" onClick={handleCancelEdit} className="action-button delete-button" style={{marginLeft: '10px'}}>
              Cancelar
            </button>
          )}
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="client-list-section"> {/* Usamos la clase CSS aquí */}
        <h3>Lista de Clientes</h3>
        {clientes.length === 0 ? (
          <p>No hay clientes registrados.</p>
        ) : (
          <table className="clientes-list-table"> {/* Añadimos la clase para el nuevo CSS */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(client => (
                <tr key={client.id}>
                  <td data-label="ID">{client.id}</td>
                  <td data-label="Nombre">{client.nombre}</td>
                  <td data-label="Email">{client.email || 'N/A'}</td>
                  <td data-label="Teléfono">{client.telefono || 'N/A'}</td>
                  <td data-label="Dirección">{client.direccion || 'N/A'}</td>
                  <td data-label="Acciones">
                    <button onClick={() => handleEdit(client)} className="action-button edit-button" title="Editar">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="action-button delete-button" title="Eliminar">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientesPage;
