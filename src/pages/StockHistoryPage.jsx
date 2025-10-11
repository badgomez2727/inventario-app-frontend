import React, { useEffect, useState } from 'react';
import { getStockMovementsHistory } from '../services/apiService';

function StockHistoryPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStockMovementsHistory();
        setMovements(data);
      } catch (err) {
        console.error('Error al cargar historial de movimientos de stock:', err);
        setError(err.message || 'No se pudo cargar el historial de movimientos de stock.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600">Cargando historial de stock...</p>;
  if (error)
    return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;
  if (movements.length === 0)
    return <p className="text-center text-gray-500">No hay movimientos de stock registrados.</p>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Historial de Movimientos de Stock
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
            <tr>
              <th className="px-2 py-2 text-center">ID</th>
              <th className="px-2 py-2 text-left">Producto</th>
              <th className="px-2 py-2 text-left hidden sm:table-cell">SKU</th>
              <th className="px-2 py-2 text-center hidden md:table-cell">Tipo</th>
              <th className="px-2 py-2 text-center">Cantidad</th>
              <th className="px-2 py-2 text-left">Motivo</th>
              <th className="px-2 py-2 text-center hidden md:table-cell">Fecha</th>
              <th className="px-2 py-2 text-left hidden lg:table-cell">Usuario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
            {movements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-center">{movement.id}</td>
                <td className="px-2 py-2">{movement.product?.nombre || 'N/A'}</td>
                <td className="px-2 py-2 hidden sm:table-cell">{movement.product?.sku || 'N/A'}</td>
                <td className="px-2 py-2 text-center hidden md:table-cell">{movement.tipo}</td>
                <td className="px-2 py-2 text-center ">{movement.cantidad}</td>
                <td className="px-2 py-2 ">{movement.motivo}</td>
                <td className="px-2 py-2 text-center hidden md:table-cell">
                  {new Date(movement.fechaMovimiento).toLocaleDateString('es-CO')}
                </td>
                <td className="px-2 py-2 hidden lg:table-cell">{movement.user?.nombreUsuario || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockHistoryPage;
