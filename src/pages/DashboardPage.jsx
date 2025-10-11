// venta_inventario_app/frontend/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { getGeneralStats, getInventoryValue, getMonthlySales, getTopSellingProducts, getProducts } from '../services/apiService'; // Importamos getProducts
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

import { formatCOP } from '../utils/formatters';

// Define un umbral para considerar "bajo stock"
const LOW_STOCK_THRESHOLD = 10; 

// Componente para las tarjetas de métricas
const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 text-center transition-transform transform hover:scale-105">
    <h4 className="text-lg font-semibold text-gray-600 mb-2">{title}</h4>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

function DashboardPage() {
  const [generalStats, setGeneralStats] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(null);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async (start, end) => {
    try {
      setLoading(true);
      setError(null);

      const [stats, inventory, monthlySales, topProducts, allProducts] = await Promise.all([
        getGeneralStats(),
        getInventoryValue(),
        getMonthlySales(start, end),
        getTopSellingProducts(start, end),
        getProducts(),
      ]);
      setGeneralStats(stats);
      setInventoryValue(inventory);
      setMonthlySalesData(monthlySales);
      setTopSellingProducts(topProducts);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData(startDate || null, endDate || null); 
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [startDate, endDate]);

  const handleResetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading) return <p className="text-center text-xl font-semibold text-gray-600 py-10">Cargando dashboard...</p>;
  if (error) return <p className="text-center text-xl font-semibold text-red-500 py-10">{error}</p>;
  
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Dashboard Administrativo</h2>
      
      {generalStats && inventoryValue && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Filtrar Reportes por Fecha:</h3>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <label htmlFor="startDate" className="text-gray-700">Desde:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <label htmlFor="endDate" className="text-gray-700">Hasta:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <button 
            onClick={handleResetDates} 
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors flex-1"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Sección de Alerta de Bajo Stock */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Productos con Bajo Stock ({lowStockProducts.length})</h3>
        {lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 rounded-tl-xl">Producto</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4 rounded-tr-xl">Stock Actual</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-red-50 transition-colors">
                    <td className="p-4">{product.nombre}</td>
                    <td className="p-4">{product.sku}</td>
                    <td className="p-4 font-bold text-red-500">{product.stockActual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-lg text-green-600">¡Excelente! No hay productos con bajo stock.</p>
        )}
      </div>

      {monthlySalesData.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ventas Mensuales</h3>
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
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-center text-lg text-gray-500">No hay datos de ventas mensuales para mostrar en el período seleccionado.</p>
        </div>
      )}

      {/* Sección de Productos Más Vendidos */}
      {topSellingProducts.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Top 5 Productos Más Vendidos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 rounded-tl-xl">Producto</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4 rounded-tr-xl">Cantidad Vendida</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((product, index) => (
                  <tr key={product.productId || index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4">{product.productName}</td>
                    <td className="p-4">{product.productSku}</td>
                    <td className="p-4">{product.totalQuantitySold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-center text-lg text-gray-500">No hay datos de productos más vendidos para mostrar en el período seleccionado.</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
