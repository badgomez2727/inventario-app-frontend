// venta_inventario_app/frontend/src/components/StockFormModal.jsx
import React, { useState } from 'react';
import { addStockEntry, addStockExit } from '../services/apiService';

function StockFormModal({ product, onClose, onStockUpdated }) {
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const data = {
      productId: product.id,
      cantidad: parseInt(cantidad),
      motivo,
    };

    try {
      if (type === 'ENTRADA') {
        await addStockEntry(data);
        setMessage(`Entrada de stock de ${cantidad} unidades registrada con éxito.`);
      } else {
        await addStockExit(data);
        setMessage(`Salida de stock de ${cantidad} unidades registrada con éxito.`);
      }
      setCantidad('');
      setMotivo('');
      onStockUpdated();
    } catch (err) {
      console.error('Error al registrar movimiento de stock:', err);
      setError(err.message || 'Error al registrar el movimiento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Gestión de Stock: {product.nombre}
        </h2>
        <p className="text-gray-600 mb-4">
          Stock actual: <strong>{product.stockActual}</strong>
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Motivo:</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Compra a proveedor, Venta, Daño"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={(e) => handleSubmit(e, 'ENTRADA')}
              type="button"
              disabled={loading || cantidad <= 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
            >
              Registrar Entrada
            </button>
            <button
              onClick={(e) => handleSubmit(e, 'SALIDA')}
              type="button"
              disabled={loading || cantidad <= 0}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
            >
              Registrar Salida
            </button>
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
            >
              Cerrar
            </button>
          </div>

          {message && (
            <p className="mt-3 text-green-600 font-medium">{message}</p>
          )}
          {error && (
            <p className="mt-3 text-red-600 font-medium">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default StockFormModal;
