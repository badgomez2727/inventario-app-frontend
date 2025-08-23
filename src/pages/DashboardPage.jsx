// venta_inventario_app/frontend/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { getGeneralStats, getInventoryValue, getMonthlySales, getTopSellingProducts, getProducts } from '../services/apiService'; // Importamos getProducts
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
import { formatCOP } from '../utils/formatters';

// Define un umbral para considerar "bajo stock"
const LOW_STOCK_THRESHOLD = 10; 

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
  const [lowStockProducts, setLowStockProducts] = useState([]); // Nuevo estado para productos con bajo stock
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros de fecha
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Función para obtener y actualizar todos los datos del dashboard
  const fetchData = async (start, end) => {
    try {
      setLoading(true);
      setError(null);

      const [stats, inventory, monthlySales, topProducts, allProducts] = await Promise.all([ // También obtenemos todos los productos
        getGeneralStats(),
        getInventoryValue(),
        getMonthlySales(start, end),
        getTopSellingProducts(start, end),
        getProducts(), // Nueva llamada para obtener todos los productos
      ]);
      setGeneralStats(stats);
      setInventoryValue(inventory);
      setMonthlySalesData(monthlySales);
      setTopSellingProducts(topProducts);

      // Filtra los productos con bajo stock
      const filteredLowStock = allProducts.filter(product => 
        product.stockActual <= LOW_STOCK_THRESHOLD
      );
      setLowStockProducts(filteredLowStock);

    } catch (err) {
      setError('No se pudieron cargar los datos del dashboard.');
      console.error('Error al cargar datos del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para aplicar el debounce a la carga de datos
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData(startDate || null, endDate || null); 
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [startDate, endDate]);

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
          <DashboardCard
            title="Valor Total (Venta)"
            value={formatCOP(inventoryValue.valorTotalVenta)}
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

      {/* Sección de Alerta de Bajo Stock */}
      <div className="dashboard-chart-section" style={{ marginTop: '2rem' }}>
        <h3>Productos con Bajo Stock ({lowStockProducts.length})</h3>
        {lowStockProducts.length > 0 ? (
          <table className="low-stock-table low-stock-table-responsive"> {/* <-- Añadimos la clase responsive */}
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Stock Actual</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => (
                <tr key={product.id} className="low-stock-row">
                  <td data-label="Producto">{product.nombre}</td> {/* <-- Añadimos data-label */}
                  <td data-label="SKU">{product.sku}</td> {/* <-- Añadimos data-label */}
                  <td data-label="Stock Actual" style={{ fontWeight: 'bold', color: 'red' }}>{product.stockActual}</td> {/* <-- Añadimos data-label */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="success-message">¡Excelente! No hay productos con bajo stock.</p>
        )}
      </div>

      {monthlySalesData.length > 0 ? (
        <div className="dashboard-chart-section" style={{ marginTop: '2rem' }}>
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
        <div className="no-data-message" style={{ marginTop: '2rem' }}>
          <p>No hay datos de ventas mensuales para mostrar en el período seleccionado.</p>
        </div>
      )}

      {/* Sección de Productos Más Vendidos */}
      {topSellingProducts.length > 0 ? (
        <div className="dashboard-chart-section" style={{ marginTop: '2rem' }}>
          <h3>Top 5 Productos Más Vendidos</h3>
          <table className="top-products-table">
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
