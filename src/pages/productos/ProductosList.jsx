// venta_inventario_app/frontend/src/pages/productos/ProductosList.jsx

import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../services/apiService'; // <-- ¡Importamos deleteProduct!
import StockFormModal from '../../components/StockFormModal';
import { FaEdit, FaTrashAlt, FaBoxes } from 'react-icons/fa'; 

function ProductosList({ onEditClick }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError(err.message || 'No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [refreshList]);

  const handleOpenStockModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseStockModal = () => {
    setSelectedProduct(null);
    setRefreshList(prev => !prev);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setRefreshList(prev => !prev); // Refresca la lista después de eliminar
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        setError(err.message || 'Error al eliminar el producto.');
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (productos.length === 0) return <p>No hay productos registrados en esta compañía.</p>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Proveedor</th> {/* <-- ¡Nueva columna! */}
            <th>Stock Actual</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Unidad</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.sku}</td>
              <td>{producto.supplier?.nombre || 'N/A'}</td> {/* <-- Muestra el nombre del proveedor */}
              <td>{producto.stockActual}</td>
              <td>${parseFloat(producto.precioCompra).toFixed(2)}</td>
              <td>${parseFloat(producto.precioVenta).toFixed(2)}</td>
              <td>{producto.unidadMedida}</td>
              <td>{producto.categoria}</td>
              <td>
                <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => onEditClick(producto)}
                  className="action-button edit-button"
                  title="Editar"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="action-button delete-button"
                  title="Eliminar"
                >
                  <FaTrashAlt size={12} />
                </button>
                <button
                  onClick={() => handleOpenStockModal(producto)}
                  className="action-button stock-button"
                  title="Gestión de Stock"
                >
                  <FaBoxes size={12} />
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedProduct && (
        <StockFormModal
          product={selectedProduct}
          onClose={handleCloseStockModal}
          onStockUpdated={handleCloseStockModal}
        />
      )}
    </div>
  );
}

export default ProductosList;