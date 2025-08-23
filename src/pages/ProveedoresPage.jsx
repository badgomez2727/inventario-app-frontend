// venta_inventario_app/frontend/src/pages/ProveedoresPage.jsx

import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/apiService'; // Ruta corregida
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../styles/ProveedoresPage.css'; // Importamos el nuevo CSS

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuppliers();
      setProveedores(data);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setError(err.message || 'No se pudieron cargar los proveedores.');
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
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData);
        setMessage('Proveedor actualizado con éxito.');
      } else {
        await createSupplier(formData);
        setMessage('Proveedor creado con éxito.');
      }
      setFormData({ nombre: '', contacto: '', telefono: '', direccion: '' });
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (err) {
      console.error('Error al guardar proveedor:', err);
      setError(err.message || 'Error al guardar el proveedor.');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      nombre: supplier.nombre,
      contacto: supplier.contacto || '',
      telefono: supplier.telefono || '',
      direccion: supplier.direccion || ''
    });
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      setMessage('');
      setError('');
      try {
        await deleteSupplier(supplierId);
        setMessage('Proveedor eliminado con éxito.');
        fetchSuppliers();
      } catch (err) {
        console.error('Error al eliminar proveedor:', err);
        setError(err.message || 'Error al eliminar el proveedor.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplier(null);
    setFormData({ nombre: '', contacto: '', telefono: '', direccion: '' });
    setMessage('');
    setError('');
  };

  if (loading) return <p>Cargando proveedores...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="proveedores-list-container">
      <h2>Gestión de Proveedores</h2>

      <div className="supplier-form-section"> {/* Usamos la clase CSS aquí */}
        <h3>{editingSupplier ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}</h3>
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
            <label htmlFor="contacto">Contacto:</label>
            <input
              type="text"
              id="contacto"
              name="contacto"
              value={formData.contacto}
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
          <button type="submit">{editingSupplier ? 'Actualizar Proveedor' : 'Crear Proveedor'}</button>
          {editingSupplier && (
            <button type="button" onClick={handleCancelEdit} className="action-button delete-button" style={{marginLeft: '10px'}}>
              Cancelar
            </button>
          )}
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="supplier-list-section"> {/* Usamos la clase CSS aquí */}
        <h3>Lista de Proveedores</h3>
        {proveedores.length === 0 ? (
          <p>No hay proveedores registrados.</p>
        ) : (
          <table className="proveedores-list-table"> {/* Añadimos la clase para el nuevo CSS */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map(supplier => (
                <tr key={supplier.id}>
                  <td data-label="ID">{supplier.id}</td>
                  <td data-label="Nombre">{supplier.nombre}</td>
                  <td data-label="Contacto">{supplier.contacto || 'N/A'}</td>
                  <td data-label="Teléfono">{supplier.telefono || 'N/A'}</td>
                  <td data-label="Dirección">{supplier.direccion || 'N/A'}</td>
                  <td data-label="Acciones">
                    <button onClick={() => handleEdit(supplier)} className="action-button edit-button" title="Editar">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(supplier.id)} className="action-button delete-button" title="Eliminar">
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

export default ProveedoresPage;
