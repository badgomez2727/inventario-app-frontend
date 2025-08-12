// venta_inventario_app/frontend/src/pages/productos/ProductoForm.jsx

import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, getSuppliers } from '../../services/apiService';
import { formatCOP } from '../../utils/formatters'; // Asegúrate de que este archivo y función existan
// import '../../styles/Form.css'; // <-- ¡Línea eliminada!

const ProductoForm = ({ onProductCreated, productToEdit, onEditComplete }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sku: '',
    precioCompra: '',
    precioVenta: '',
    stockActual: '', // <-- Inicializamos como cadena vacía
    unidadMedida: '',
    categoria: '',
    imagenUrl: '',
    supplierId: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  // Cargar proveedores al inicio
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        console.error('Error al cargar proveedores:', err);
        setError('No se pudieron cargar los proveedores.');
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Cargar datos del producto a editar cuando `productToEdit` cambia
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre || '',
        descripcion: productToEdit.descripcion || '',
        sku: productToEdit.sku || '',
        // Aseguramos que los números sean strings para el input, o cadena vacía si es null/undefined
        // toFixed(2) para precio podría ser útil si no quieres que se vea un .0000000001
        precioCompra: productToEdit.precioCompra != null ? productToEdit.precioCompra.toString() : '',
        precioVenta: productToEdit.precioVenta != null ? productToEdit.precioVenta.toString() : '',
        stockActual: productToEdit.stockActual != null ? productToEdit.stockActual.toString() : '', // <-- Aquí convertimos a string
        unidadMedida: productToEdit.unidadMedida || '',
        categoria: productToEdit.categoria || '',
        imagenUrl: productToEdit.imagenUrl || '',
        supplierId: productToEdit.supplierId != null ? productToEdit.supplierId.toString() : '', // <-- Convertir a string
      });
    } else {
      // Resetear el formulario para un nuevo producto
      setFormData({
        nombre: '', descripcion: '', sku: '', precioCompra: '', precioVenta: '',
        stockActual: '', unidadMedida: '', categoria: '', imagenUrl: '', supplierId: '',
      });
    }
    setMessage('');
    setError('');
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Manejo especial para inputs numéricos: permiten cadena vacía pero no texto no numérico
    if (['precioCompra', 'precioVenta', 'stockActual', 'supplierId'].includes(name)) {
      // Solo actualiza si es un número válido o una cadena vacía
      if (value === '' || !isNaN(Number(value))) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validación frontend: asegurar que los campos obligatorios no estén vacíos
    if (!formData.nombre || !formData.sku || formData.precioCompra === '' || formData.precioVenta === '' || formData.stockActual === '' || !formData.unidadMedida || !formData.categoria) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Convertir a número los campos numéricos antes de enviar al backend
    // `Number()` convierte "" a 0, lo cual puede no ser deseable para IDs opcionales.
    // Usaremos un condicional para `supplierId` para asegurar que sea `null` si está vacío.
    const dataToSend = {
      ...formData,
      precioCompra: Number(formData.precioCompra),
      precioVenta: Number(formData.precioVenta),
      stockActual: Number(formData.stockActual),
      supplierId: formData.supplierId === '' ? null : Number(formData.supplierId)
    };

    try {
      let response;
      if (productToEdit) {
        response = await updateProduct(productToEdit.id, dataToSend);
        setMessage('Producto actualizado con éxito!');
        onEditComplete(); // Llama a la función para limpiar el estado de edición y refrescar la lista
      } else {
        response = await createProduct(dataToSend);
        setMessage('Producto creado con éxito!');
        // Limpiar el formulario después de la creación exitosa
        setFormData({
          nombre: '', descripcion: '', sku: '', precioCompra: '', precioVenta: '',
          stockActual: '', unidadMedida: '', categoria: '', imagenUrl: '', supplierId: '',
        });
        onProductCreated(); // Llama a la función para refrescar la lista
      }
      console.log('Operación exitosa:', response);
    } catch (err) {
      console.error('Error durante la operación del producto:', err);
      // Muestra el mensaje de error del backend si está disponible
      setError(err.message || 'Error en la operación del producto.');
    }
  };

  if (loadingSuppliers) return <p>Cargando proveedores...</p>;
  // El error de carga de proveedores ya se muestra arriba, no es necesario aquí.
  // if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="form-container">
      <h2>{productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
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
            <label htmlFor="sku">SKU:</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="precioCompra">Precio Compra:</label>
            <input
              type="number"
              id="precioCompra"
              name="precioCompra"
              value={formData.precioCompra}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="precioVenta">Precio Venta:</label>
            <input
              type="number"
              id="precioVenta"
              name="precioVenta"
              value={formData.precioVenta}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="stockActual">Stock Actual:</label>
            <input
              type="number"
              id="stockActual"
              name="stockActual"
              value={formData.stockActual} // <-- El valor siempre debe ser una cadena
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="unidadMedida">Unidad de Medida:</label>
            <input
              type="text"
              id="unidadMedida"
              name="unidadMedida"
              value={formData.unidadMedida}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="categoria">Categoría:</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="supplierId">Proveedor:</label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Seleccione un proveedor (Opcional)</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="imagenUrl">URL Imagen:</label>
          <input
            type="text"
            id="imagenUrl"
            name="imagenUrl"
            value={formData.imagenUrl}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit">{productToEdit ? 'Actualizar Producto' : 'Crear Producto'}</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProductoForm;
