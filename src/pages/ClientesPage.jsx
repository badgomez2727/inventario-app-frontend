// frontend/src/pages/ClientesPage.jsx

import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../services/apiService';
import '../App.css';

const ClientesPage = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  });
  const [editingClientId, setEditingClientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingClientId) {
        await updateClient(editingClientId, form);
        setSuccess('Cliente actualizado con éxito.');
      } else {
        await createClient(form);
        setSuccess('Cliente creado con éxito.');
      }
      resetForm();
      fetchClients();
    } catch (err) {
      setError(err.message || 'Error al guardar el cliente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', email: '', telefono: '', direccion: '' });
    setEditingClientId(null);
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditingClientId(client.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await deleteClient(id);
        setSuccess('Cliente eliminado con éxito.');
        fetchClients();
      } catch (err) {
        setError('Error al eliminar el cliente.');
      }
    }
  };

  return (
    <>
      <div className="form-container">
        <h2>{editingClientId ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="nav-buttons">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Cargando...' : editingClientId ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
            {editingClientId && (
              <button type="button" className="login-button" onClick={resetForm} style={{ backgroundColor: '#ccc' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-container">
        <h2>Lista de Clientes</h2>
        {/* LÍNEA CORREGIDA: Ahora usa 'clients' en lugar de 'clientes' */}
        {clients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.nombre}</td>
                  <td>{client.email}</td>
                  <td>{client.telefono}</td>
                  <td>{client.direccion}</td>
                  <td>
                    <button onClick={() => handleEdit(client)} className="login-button" style={{ marginRight: '10px' }}>Editar</button>
                    <button onClick={() => handleDelete(client.id)} className="login-button" style={{ backgroundColor: '#e53e3e' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay clientes registrados.</p>
        )}
      </div>
    </>
  );
};

export default ClientesPage;