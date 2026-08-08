import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/apiService";
import StockFormModal from "../../components/StockFormModal";
import { formatCOP } from "../../utils/formatters";
import { FaEdit, FaTrashAlt, FaBoxes, FaSearch, FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ProductosList({ onEditClick }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // NUEVOS ESTADOS PARA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Llamamos a la API con la página actual
        const data = await getProducts(currentPage, 10);
        
        // 2. IMPORTANTE: 'data' ahora es un objeto, no un array.
        // Extraemos la lista de productos de data.products
        if (data && data.products) {
          setProductos(data.products); 
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.totalCount || 0);
        } else {
          // Por si acaso el backend devuelve el formato antiguo todavía
          setProductos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error en fetchProductos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [refreshList, currentPage]);

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
        alert("No se pudo eliminar el producto.");
      }
    }
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) return "bg-red-100 text-red-700 font-bold border border-red-200";
    if (stock <= 5) return "bg-orange-100 text-orange-700 font-bold border border-orange-200";
    return "bg-emerald-50 text-emerald-700 border border-emerald-100";
  };

  // Filtrado local (Opcional: Si quieres búsqueda global, deberías hacerla desde el backend)
  const filteredProducts = productos.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.categoria.toLowerCase().includes(term)
    );
  });

  if (loading) return <div className="p-10 text-center text-emerald-600 font-bold animate-pulse uppercase tracking-widest text-xs">Sincronizando inventario...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-medium">{error}</div>
      )}

      {/* Header y Buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Catálogo de <span className="text-emerald-500">Productos</span></h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">Total en sistema: {totalCount} artículos</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en esta página..."
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
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-emerald-500 transition-colors">
                        <FaTag />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{p.nombre}</p>
                        <p className="text-[10px] font-mono text-gray-400">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500 font-medium">{p.categoria}</td>
                  <td className="px-2 py-4 text-center font-bold">
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] ${getStockBadge(p.stockActual)}`}>
                        {p.stockActual} 
                        <span className="text-[9px] font-normal opacity-70">{p.unidadMedida}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">{formatCOP(p.precioVenta)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenStockModal(p)} title="Ajustar Stock" className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20">
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

        {/* --- CONTROLES DE PAGINACIÓN --- */}
        <div className="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            Página <span className="text-emerald-600">{currentPage}</span> de {totalPages}
          </p>
          
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronLeft /> Anterior
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Siguiente <FaChevronRight />
            </button>
          </div>
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