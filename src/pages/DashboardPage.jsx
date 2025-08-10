// venta_inventario_app/frontend/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { getGeneralStats, getInventoryValue, getMonthlySales } from '../services/apiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css'; // <-- Asegúrate de que esta línea esté descomentada
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, inventory, sales] = await Promise.all([
          getGeneralStats(),
          getInventoryValue(),
          getMonthlySales(),
        ]);
        setGeneralStats(stats);
        setInventoryValue(inventory);
        setMonthlySalesData(sales);
      } catch (err) {
        setError('No se pudieron cargar los datos del dashboard.');
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <p>No hay datos de ventas para mostrar en el dashboard.</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
