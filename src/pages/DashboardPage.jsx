// venta_inventario_app/frontend/src/pages/DashboardPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { getGeneralStats, getInventoryValue, getMonthlySales, getTopSellingProducts } from '../services/apiService'; // <-- Importar la nueva función
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
import { formatCOP } from '../utils/formatters'; // Asegúrate de tener este archivo y su contenido

// Componente para las tarjetas de métricas
const DashboardCard = ({ title, value }) => {
  const valueRef = useRef(null); // Referencia al elemento del valor
  const containerRef = useRef(null); // Referencia al contenedor del valor

  // Efecto para ajustar dinámicamente el tamaño de la fuente
  useEffect(() => {
    const adjustFontSize = () => {
      const valueElement = valueRef.current;
      const containerElement = containerRef.current;

      if (!valueElement || !containerElement) return;

      const containerWidth = containerElement.offsetWidth;
      let currentFontSize = parseFloat(window.getComputedStyle(valueElement).fontSize);
      const originalFontSize = currentFontSize; // Guardamos el tamaño original

      // Reducimos el tamaño de la fuente si el texto desborda el contenedor
      while (valueElement.scrollWidth > containerWidth && currentFontSize > 12) { // Mínimo 12px
        currentFontSize -= 0.5;
        valueElement.style.fontSize = `${currentFontSize}px`;
      }

      // Si el texto se encogió, pero ahora hay espacio, lo agrandamos un poco (sin superar el original)
      // Esto evita que quede demasiado pequeño si el valor cambia a uno corto
      while (valueElement.scrollWidth < containerWidth && currentFontSize < originalFontSize) {
        currentFontSize += 0.5;
        if (currentFontSize > originalFontSize) {
          currentFontSize = originalFontSize;
        }
        valueElement.style.fontSize = `${currentFontSize}px`;
      }
    };

    // Ajustamos al montar y cada vez que el valor cambie
    adjustFontSize();
    // También ajustamos al redimensionar la ventana para adaptarnos a cambios de layout
    window.addEventListener('resize', adjustFontSize);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener('resize', adjustFontSize);
    };
  }, [value]); // El efecto se vuelve a ejecutar si el 'value' cambia

  return (
    <div className="dashboard-card" ref={containerRef}> {/* El contenedor de la tarjeta */}
      <h4 className="card-title">{title}</h4>
      <p className="card-value" ref={valueRef}>{value}</p> {/* El valor con la referencia */}
    </div>
  );
};

function DashboardPage() {
  const [generalStats, setGeneralStats] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(null);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]); // <-- Nuevo estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, inventory, sales, topProducts] = await Promise.all([ // <-- Añadir la nueva promesa
          getGeneralStats(),
          getInventoryValue(),
          getMonthlySales(),
          getTopSellingProducts(), // <-- Llamada a la nueva función
        ]);
        setGeneralStats(stats);
        setInventoryValue(inventory);
        setMonthlySalesData(sales);
        setTopSellingProducts(topProducts); // <-- Guardar los datos
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

      {/* Nueva sección para los productos más vendidos */}
      {topSellingProducts.length > 0 && (
        <div className="dashboard-chart-section" style={{ marginTop: '2rem' }}>
          <h3>Productos Más Vendidos (por Cantidad)</h3>
          <table className="top-products-table"> {/* Añadir una clase para posibles estilos específicos */}
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Cantidad Total Vendida</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.productSku}</td>
                  <td>{product.totalQuantitySold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {topSellingProducts.length === 0 && !loading && (
        <div className="no-data-message" style={{ marginTop: '2rem' }}>
          <p>No hay datos de productos más vendidos para mostrar.</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
