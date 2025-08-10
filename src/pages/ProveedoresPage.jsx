// frontend/src/pages/ProveedoresPage.jsx

import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/apiService';
import '../App.css';

const ProveedoresPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    direccion: '',
  });
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de proveedores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
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
      if (editingSupplierId) {
        await updateSupplier(editingSupplierId, form);
        setSuccess('Proveedor actualizado con éxito.');
      } else {
        await createSupplier(form);
        setSuccess('Proveedor creado con éxito.');
      }
      resetForm();
      fetchSuppliers();
    } catch (err) {
      setError(err.message || 'Error al guardar el proveedor.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', contacto: '', telefono: '', direccion: '' });
    setEditingSupplierId(null);
  };

  const handleEdit = (supplier) => {
    setForm(supplier);
    setEditingSupplierId(supplier.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        await deleteSupplier(id);
        setSuccess('Proveedor eliminado con éxito.');
        fetchSuppliers();
      } catch (err) {
        setError('Error al eliminar el proveedor.');
      }
    }
  };

  return (
    <>
      <div className="form-container">
        <h2>{editingSupplierId ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}</h2>
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
              <label htmlFor="contacto">Nombre de Contacto</label>
              <input
                id="contacto"
                type="text"
                name="contacto"
                value={form.contacto}
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
              {loading ? 'Cargando...' : editingSupplierId ? 'Actualizar Proveedor' : 'Crear Proveedor'}
            </button>
            {editingSupplierId && (
              <button type="button" className="login-button" onClick={resetForm} style={{ backgroundColor: '#ccc' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-container">
        <h2>Lista de Proveedores</h2>
        {suppliers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.nombre}</td>
                  <td>{supplier.contacto}</td>
                  <td>{supplier.telefono}</td>
                  <td>{supplier.direccion}</td>
                  <td>
                    <button onClick={() => handleEdit(supplier)} className="login-button" style={{ marginRight: '10px' }}>Editar</button>
                    <button onClick={() => handleDelete(supplier.id)} className="login-button" style={{ backgroundColor: '#e53e3e' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay proveedores registrados.</p>
        )}
      </div>
    </>
  );
};

export default ProveedoresPage;