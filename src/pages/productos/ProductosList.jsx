import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/apiService";
import StockFormModal from "../../components/StockFormModal";
import { formatCOP } from "../../utils/formatters";
import { FaEdit, FaTrashAlt, FaBoxes, FaSearch } from "react-icons/fa";

function ProductosList({ onEditClick }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(err.message || "No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [refreshList]);

  const handleOpenStockModal = (product) => setSelectedProduct(product);
  const handleCloseStockModal = () => {
    setSelectedProduct(null);
    setRefreshList((prev) => !prev);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id);
        setRefreshList((prev) => !prev);
      } catch (err) {
        console.error("Error al eliminar producto:", err);
        setError(err.message || "Error al eliminar el producto.");
      }
    }
  };

  const filteredProducts = productos.filter((producto) => {
    const term = searchTerm.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(term) ||
      producto.sku.toLowerCase().includes(term) ||
      producto.categoria.toLowerCase().includes(term) ||
      (producto.supplier?.nombre?.toLowerCase().includes(term))
    );
  });

  if (loading) return <p className="text-gray-600">Cargando productos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Lista de Productos
      </h2>

      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-full sm:max-w-md">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No se encontraron productos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-2 py-2 text-left text-xs sm:text-sm">ID</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm">Nombre</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm">SKU</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm hidden md:table-cell">Proveedor</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm hidden md:table-cell">Stock</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm hidden lg:table-cell">Precio Compra</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm hidden lg:table-cell">Precio Venta</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm hidden md:table-cell">Unidad</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm hidden md:table-cell">Categoría</th>
                <th className="px-2 py-2 text-left text-xs sm:text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50 transition">
                  <td className="px-2 py-2 text-xs sm:text-sm">{producto.id}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm">{producto.nombre}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm">{producto.sku}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm hidden md:table-cell">{producto.supplier?.nombre || "N/A"}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm hidden md:table-cell">{producto.stockActual}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm hidden lg:table-cell">{formatCOP(producto.precioCompra)}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm hidden lg:table-cell">{formatCOP(producto.precioVenta)}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm hidden md:table-cell">{producto.unidadMedida}</td>
                  <td className="px-2 py-2 text-xs sm:text-sm hidden md:table-cell">{producto.categoria}</td>
                  <td className="px-2 py-2 flex flex-wrap gap-1">
                    <button
                      onClick={() => onEditClick(producto)}
                      className="p-1 sm:p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-xs sm:text-sm"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="p-1 sm:p-2 rounded bg-red-500 text-white hover:bg-red-600 transition text-xs sm:text-sm"
                      title="Eliminar"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      onClick={() => handleOpenStockModal(producto)}
                      className="p-1 sm:p-2 rounded bg-green-500 text-white hover:bg-green-600 transition text-xs sm:text-sm"
                      title="Gestión de Stock"
                    >
                      <FaBoxes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
