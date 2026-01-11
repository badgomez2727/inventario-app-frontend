import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/apiService";
import StockFormModal from "../../components/StockFormModal";
import { formatCOP } from "../../utils/formatters";
import { FaEdit, FaTrashAlt, FaBoxes, FaSearch, FaTag } from "react-icons/fa";

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
        const data = await getProducts();
        setProductos(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [refreshList]);

  // --- FUNCIONES CORREGIDAS ---
  const handleOpenStockModal = (product) => {
    setSelectedProduct(product);
  };

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
        alert("No se pudo eliminar el producto.");
      }
    }
  };
  // ----------------------------

  const getStockBadge = (stock) => {
    if (stock <= 0) return "bg-red-100 text-red-700 font-bold border border-red-200";
    if (stock <= 5) return "bg-orange-100 text-orange-700 font-bold border border-orange-200";
    return "bg-emerald-50 text-emerald-700 border border-emerald-100";
  };

  const filteredProducts = productos.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.categoria.toLowerCase().includes(term)
    );
  });

  if (loading) return <div className="p-10 text-center text-emerald-600 font-bold animate-pulse">Sincronizando inventario...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header y Buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Catálogo de <span className="text-emerald-500">Productos</span></h2>
          <p className="text-gray-400 text-sm">Gestiona precios, existencias y categorías.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm shadow-inner"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4 hidden md:table-cell">Categoría</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4">P. Venta</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <FaTag />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{p.nombre}</p>
                        <p className="text-[10px] font-mono text-gray-400">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500">
                    {p.categoria}
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStockBadge(p.stockActual)}`}>
                      {p.stockActual} <span className="text-[10px] font-normal">{p.unidadMedida}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">
                    {formatCOP(p.precioVenta)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenStockModal(p)} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20">
                        <FaBoxes />
                      </button>
                      <button onClick={() => onEditClick(p)} className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-white text-red-400 border border-red-50 rounded-xl hover:bg-red-50 transition">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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