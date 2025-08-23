// venta_inventario_app/frontend/src/pages/productos/ProductosList.jsx

import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../services/apiService';
import StockFormModal from '../../components/StockFormModal';
import { formatCOP } from '../../utils/formatters';
import { FaEdit, FaTrashAlt, FaBoxes } from 'react-icons/fa'; 
import '../../styles/ProductosList.css'; // <-- Importamos el nuevo CSS

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
        setRefreshList(prev => !prev);
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        setError(err.message || 'Error al eliminar el producto.');
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (productos.length === 0) return <p>No hay productos registrados en esta compañía.</p>;

  return (
    <div className="productos-list-container"> {/* Contenedor principal para la lista */}
      <h2>Lista de Productos</h2>
      <table className="productos-list-table"> {/* Añadimos la clase para el nuevo CSS */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Proveedor</th>
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
              <td data-label="ID">{producto.id}</td>
              <td data-label="Nombre">{producto.nombre}</td>
              <td data-label="SKU">{producto.sku}</td>
              <td data-label="Proveedor">{producto.supplier?.nombre || 'N/A'}</td>
              <td data-label="Stock Actual">{producto.stockActual}</td>
              <td data-label="Precio Compra">{formatCOP(producto.precioCompra)}</td>
              <td data-label="Precio Venta">{formatCOP(producto.precioVenta)}</td>
              <td data-label="Unidad">{producto.unidadMedida}</td>
              <td data-label="Categoría">{producto.categoria}</td>
              <td data-label="Acciones">
                <button
                  onClick={() => onEditClick(producto)}
                  className="action-button edit-button"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="action-button delete-button"
                  title="Eliminar"
                >
                  <FaTrashAlt />
                </button>
                <button
                  onClick={() => handleOpenStockModal(producto)}
                  className="action-button stock-button"
                  title="Gestión de Stock"
                >
                  <FaBoxes />
                </button>
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
