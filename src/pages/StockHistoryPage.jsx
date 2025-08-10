// venta_inventario_app/frontend/src/pages/StockHistoryPage.jsx

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
        console.error('Error al cargar el historial de movimientos:', err);
        setError(err.message || 'No se pudo cargar el historial de movimientos.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  if (loading) return <p>Cargando historial de stock...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (movements.length === 0) return <p>No hay movimientos de stock registrados.</p>;

  return (
    <div className="list-container">
      <h2>Historial de Movimientos de Stock</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Motivo</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {movements.map(mov => (
            <tr key={mov.id}>
              <td>{new Date(mov.fechaMovimiento).toLocaleString()}</td>
              <td style={{ color: mov.tipo === 'ENTRADA' ? 'green' : 'red' }}>
                {mov.tipo}
              </td>
              <td>{mov.product.nombre} ({mov.product.sku})</td>
              <td>{mov.cantidad}</td>
              <td>{mov.motivo}</td>
              <td>{mov.user.nombreUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockHistoryPage;