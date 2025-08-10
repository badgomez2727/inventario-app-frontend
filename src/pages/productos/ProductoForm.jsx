// venta_inventario_app/frontend/src/pages/productos/ProductoForm.jsx

import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, getSuppliers } from '../../services/apiService'; // <-- Importamos getSuppliers

function ProductoForm({ onProductCreated, productToEdit, onEditComplete }) {
  const [suppliers, setSuppliers] = useState([]); // <-- Nuevo estado para proveedores
  const [form, setForm] = useState({
    nombre: '',
    sku: '',
    descripcion: '',
    precioCompra: '',
    precioVenta: '',
    unidadMedida: '',
    categoria: '',
    imagenUrl: '',
    supplierId: '', // <-- Nuevo campo para el ID del proveedor
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // useEffect para cargar proveedores y rellenar el formulario si se edita
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData);
      } catch (err) {
        console.error('Error al obtener proveedores:', err);
        setError('Error al cargar la lista de proveedores.');
      }
    };
    fetchSuppliers();

    if (productToEdit) {
      setForm({
        nombre: productToEdit.nombre || '',
        sku: productToEdit.sku || '',
        descripcion: productToEdit.descripcion || '',
        precioCompra: productToEdit.precioCompra || '',
        precioVenta: productToEdit.precioVenta || '',
        unidadMedida: productToEdit.unidadMedida || '',
        categoria: productToEdit.categoria || '',
        imagenUrl: productToEdit.imagenUrl || '',
        supplierId: productToEdit.supplierId || '', // <-- Rellenamos el proveedor si existe
      });
      setIsEditing(true);
      setMessage(null);
      setError(null);
    } else {
      setForm({
        nombre: '', sku: '', descripcion: '', precioCompra: '', precioVenta: '', unidadMedida: '', categoria: '', imagenUrl: '', supplierId: '',
      });
      setIsEditing(false);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const productData = {
      ...form,
      precioCompra: parseFloat(form.precioCompra),
      precioVenta: parseFloat(form.precioVenta),
      supplierId: form.supplierId ? parseInt(form.supplierId, 10) : null, // <-- Aseguramos que sea un número o null
    };

    try {
      if (isEditing) {
        await updateProduct(productToEdit.id, productData);
        setMessage('Producto actualizado con éxito.');
        onEditComplete();
      } else {
        await createProduct(productData);
        setMessage('Producto creado con éxito.');
        setForm({
          nombre: '', sku: '', descripcion: '', precioCompra: '', precioVenta: '', unidadMedida: '', categoria: '', imagenUrl: '', supplierId: '',
        });
        onProductCreated();
      }
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      setError(err.message || 'Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ nombre: '', sku: '', descripcion: '', precioCompra: '', precioVenta: '', unidadMedida: '', categoria: '', imagenUrl: '', supplierId: '' });
    setIsEditing(false);
    onEditComplete();
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>SKU:</label>
            <input type="text" name="sku" value={form.sku} onChange={handleChange} required />
          </div>
          <div>
            <label>Precio Compra:</label>
            <input type="number" step="0.01" name="precioCompra" value={form.precioCompra} onChange={handleChange} required />
          </div>
          <div>
            <label>Precio Venta:</label>
            <input type="number" step="0.01" name="precioVenta" value={form.precioVenta} onChange={handleChange} required />
          </div>
          <div>
            <label>Unidad de Medida:</label>
            <input type="text" name="unidadMedida" value={form.unidadMedida} onChange={handleChange} />
          </div>
          <div>
            <label>Categoría:</label>
            <input type="text" name="categoria" value={form.categoria} onChange={handleChange} />
          </div>
          <div>
            <label>Proveedor:</label>
            <select className="form-select" name="supplierId" value={form.supplierId} onChange={handleChange} required>
              <option value="">Selecciona un proveedor</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="3"></textarea>
        </div>
        <div>
          <label>URL Imagen (opcional):</label>
          <input type="text" name="imagenUrl" value={form.imagenUrl} onChange={handleChange} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button type="submit" disabled={loading} style={{ backgroundColor: isEditing ? '#ffc107' : '#28a745' }}>
            {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
          {isEditing && (
            <button type="button" onClick={handleCancel} style={{ backgroundColor: '#dc3545' }}>
              Cancelar
            </button>
          )}
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default ProductoForm;