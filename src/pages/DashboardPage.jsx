// venta_inventario_app/frontend/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { getGeneralStats, getInventoryValue, getMonthlySales, getTopSellingProducts } from '../services/apiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
import { formatCOP } from '../utils/formatters';

// Componente para las tarjetas de métricas
const DashboardCard = ({ title, value }) => (
  <div className="dashboard-card">
    <h4 className="card-title">{title}</h4>
    <p className="card-value">{value}</p>
  </div>
);

function DashboardPage() {
  const [generalStats, setGeneralStats] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(null);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros de fecha
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Función para obtener y actualizar todos los datos del dashboard
  const fetchData = async (start, end) => { // Ahora recibe las fechas como argumentos
    try {
      setLoading(true);
      setError(null);

      const [stats, inventory, monthlySales, topProducts] = await Promise.all([
        getGeneralStats(),
        getInventoryValue(),
        getMonthlySales(start, end), // Usamos las fechas pasadas como argumento
        getTopSellingProducts(start, end), // Usamos las fechas pasadas como argumento
      ]);
      setGeneralStats(stats);
      setInventoryValue(inventory);
      setMonthlySalesData(monthlySales);
      setTopSellingProducts(topProducts);
    } catch (err) {
      setError('No se pudieron cargar los datos del dashboard.');
      console.error('Error al cargar datos del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para aplicar el debounce a la carga de datos
  useEffect(() => {
    // Limpiamos cualquier temporizador anterior para evitar llamadas múltiples
    const handler = setTimeout(() => {
      // Pasamos los estados actuales de startDate y endDate a fetchData
      fetchData(startDate || null, endDate || null); 
    }, 500); // Espera 500ms después de que el usuario deje de cambiar las fechas

    // Función de limpieza: se ejecuta si el componente se desmonta o si las dependencias cambian antes de que el temporizador se dispare
    return () => {
      clearTimeout(handler);
    };
  }, [startDate, endDate]); // Las dependencias siguen siendo startDate y endDate

  // Función para resetear los filtros de fecha
  const handleResetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading) return <p className="loading-message">Cargando dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;
  
  return (
    <div className="dashboard-container">
      <h2>Dashboard Administrativo</h2>
      
      {generalStats && inventoryValue && (
        <div className="dashboard-cards-grid">
          <DashboardCard title="Productos Registrados" value={generalStats.productCount} />
          <DashboardCard title="Clientes Registrados" value={generalStats.clientCount} />
          <DashboardCard title="Proveedores Registrados" value={generalStats.supplierCount} />
          <DashboardCard
            title="Valor Inventario (Costo)"
            value={formatCOP(inventoryValue.valorTotalCosto)}
          />
        </div>
      )}

      {/* Sección de Filtros de Fecha */}
      <div className="date-filters-section">
        <h3>Filtrar Reportes por Fecha:</h3>
        <div className="date-inputs">
          <label htmlFor="startDate">Desde:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate">Hasta:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleResetDates} className="reset-button">Limpiar Filtros</button>
        </div>
      </div>


      {monthlySalesData.length > 0 ? (
        <div className="dashboard-chart-section">
          <h3>Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCOP(value)} />
              <Legend />
              <Bar dataKey="total" fill="#4B6587" name="Total de Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="no-data-message">
          <p>No hay datos de ventas mensuales para mostrar en el período seleccionado.</p>
        </div>
      )}

      {/* Sección de Productos Más Vendidos */}
      {topSellingProducts.length > 0 ? (
        <div className="dashboard-chart-section" style={{ marginTop: '2rem' }}>
          <h3>Top 5 Productos Más Vendidos</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Cantidad Vendida</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product, index) => (
                <tr key={product.productId || index}>
                  <td>{product.productName}</td>
                  <td>{product.productSku}</td>
                  <td>{product.totalQuantitySold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-message" style={{ marginTop: '2rem' }}>
          <p>No hay datos de productos más vendidos para mostrar en el período seleccionado.</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
