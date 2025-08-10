// venta_inventario_app/frontend/src/pages/SalesHistoryPage.jsx

import React, { useEffect, useState } from 'react';
import { getSales } from '../services/apiService';

const SalesHistoryPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSales();
        setSales(data);
      } catch (err) {
        console.error('Error al cargar el historial de ventas:', err);
        setError(err.message || 'No se pudo cargar el historial de ventas.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <p>Cargando historial de ventas...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (sales.length === 0) return <p>No hay ventas registradas.</p>;

  return (
    <div className="list-container">
      <h2>Historial de Ventas</h2>
      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Vendedor</th>
            <th>Artículos</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{new Date(sale.fechaVenta).toLocaleString()}</td>
              <td>{sale.user.nombreUsuario}</td>
              <td>
                <ul>
                  {sale.saleItems.map(item => (
                    <li key={item.id}>
                      {item.product.nombre} ({item.cantidad} unidades)
                    </li>
                  ))}
                </ul>
              </td>
              <td>${Number(sale.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesHistoryPage;