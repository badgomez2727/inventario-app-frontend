import React, { useEffect, useState } from 'react';
import { getStockMovementsHistory } from '../services/apiService';
import { FaHistory, FaArrowUp, FaArrowDown, FaBoxOpen } from 'react-icons/fa';

function StockHistoryPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        const data = await getStockMovementsHistory();
        setMovements(data);
      } catch (err) {
        setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  // Función para dar estilo al tipo de movimiento
  const renderTipoBadge = (tipo) => {
    const esEntrada = tipo.toLowerCase().includes('entrada') || tipo.toLowerCase().includes('compra');
    return (
      <span className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
        esEntrada ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
      }`}>
        {esEntrada ? <FaArrowUp size={8}/> : <FaArrowDown size={8}/>}
        {tipo}
      </span>
    );
  };

  if (loading) return <div className="p-10 text-center text-emerald-600 font-bold animate-pulse">Analizando historial de stock...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-900 rounded-xl text-emerald-500 shadow-lg">
            <FaHistory size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">Kardex de <span className="text-emerald-500">Inventario</span></h2>
            <p className="text-gray-500 text-sm">Rastreo detallado de cada unidad en tu negocio.</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center font-medium border border-red-100">{error}</div>
      ) : movements.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center space-y-3">
          <FaBoxOpen className="mx-auto text-gray-300 text-5xl" />
          <p className="text-gray-500 font-medium">Aún no hay registros de movimientos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Producto / SKU</th>
                  <th className="px-6 py-4 text-center">Tipo</th>
                  <th className="px-6 py-4 text-center">Cant.</th>
                  <th className="px-6 py-4 hidden md:table-cell">Motivo</th>
                  <th className="px-6 py-4 text-center">Fecha</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{m.product?.nombre || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{m.product?.sku || 'SIN-SKU'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderTipoBadge(m.tipo)}
                    </td>
                    <td className="px-6 py-4 text-center font-black text-gray-700">
                      {m.cantidad}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-500 italic text-xs">
                      {m.motivo}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-gray-700 font-medium">
                        {new Date(m.fechaMovimiento).toLocaleDateString('es-CO')}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(m.fechaMovimiento).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {m.user?.nombreUsuario || 'Sistema'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockHistoryPage;