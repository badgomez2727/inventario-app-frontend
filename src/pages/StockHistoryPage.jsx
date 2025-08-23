// venta_inventario_app/frontend/src/pages/StockHistoryPage.jsx

import React, { useEffect, useState } from 'react';
import { getStockMovementsHistory } from '../services/apiService'; // <-- Ruta corregida
import '../styles/StockHistoryPage.css'; // <-- Ruta corregida

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

  if (loading) return <p>Cargando historial de stock...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (movements.length === 0) return <p>No hay movimientos de stock registrados.</p>;

  return (
    <div className="stock-history-container"> {/* Contenedor principal */}
      <h2>Historial de Movimientos de Stock</h2>
      <table className="stock-history-table"> {/* Añadimos una clase para el nuevo CSS */}
        <thead>
          <tr>
            <th>ID Mov.</th>
            <th>Producto</th>
            <th>SKU</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Motivo</th>
            <th>Fecha</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {movements.map(movement => (
            <tr key={movement.id}>
              <td data-label="ID Mov.">{movement.id}</td> {/* Añadimos data-label */}
              <td data-label="Producto">{movement.product?.nombre || 'N/A'}</td>
              <td data-label="SKU">{movement.product?.sku || 'N/A'}</td>
              <td data-label="Tipo">{movement.tipo}</td>
              <td data-label="Cantidad">{movement.cantidad}</td>
              <td data-label="Motivo">{movement.motivo}</td>
              <td data-label="Fecha">{new Date(movement.fechaMovimiento).toLocaleDateString('es-CO')}</td>
              <td data-label="Usuario">{movement.user?.nombreUsuario || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockHistoryPage;
