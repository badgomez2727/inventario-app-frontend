import React, { useEffect, useState } from 'react';
import { getGeneralStats, getInventoryValue, getMonthlySales, getTopSellingProducts, getProducts } from '../services/apiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { formatCOP } from '../utils/formatters';
import { FaBoxes, FaUsers, FaTruckLoading, FaMoneyBillWave, FaExclamationTriangle, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa';

const LOW_STOCK_THRESHOLD = 10;

// Tarjetas mejoradas con Iconos y Colores
const DashboardCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex items-center gap-5 transition-all hover:shadow-md">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 leading-none mb-2">{title}</h4>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
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
      
      // Llamamos a los servicios
      // Nota: getProducts() ahora devuelve un objeto con la propiedad .products
      const [stats, inventory, monthlySales, topProducts, productData] = await Promise.all([
        getGeneralStats(),
        getInventoryValue(),
        getMonthlySales(start, end),
        getTopSellingProducts(start, end),
        getProducts(1, 1000), // Traemos un límite alto para calcular alertas de stock
      ]);

      setGeneralStats(stats);
      setInventoryValue(inventory);
      setMonthlySalesData(monthlySales);
      setTopSellingProducts(topProducts);

      // --- CORRECCIÓN AQUÍ ---
      // Extraemos el array de la propiedad .products
      const productsArray = productData?.products || [];
      
      setLowStockProducts(
        productsArray.filter(p => p.stockActual <= LOW_STOCK_THRESHOLD)
      );
      // -----------------------

    } catch (err) {
      setError('No se pudieron cargar los datos.');
      console.error("Error detallado en Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => fetchData(startDate || null, endDate || null), 500);
    return () => clearTimeout(handler);
  }, [startDate, endDate]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control</h2>
          <p className="text-gray-500 font-medium italic">"Mide lo que importa, mejora lo que mides"</p>
        </div>
      </div>

      {/* --- MÉTRICAS PRINCIPALES --- */}
      {generalStats && inventoryValue && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="Productos" 
            value={generalStats.productCount} 
            icon={<FaBoxes />} 
            colorClass="bg-blue-50 text-blue-600" 
          />
          <DashboardCard 
            title="Clientes" 
            value={generalStats.clientCount} 
            icon={<FaUsers />} 
            colorClass="bg-purple-50 text-purple-600" 
          />
          <DashboardCard 
            title="Costo Inventario" 
            value={formatCOP(inventoryValue.valorTotalCosto)} 
            icon={<FaTruckLoading />} 
            colorClass="bg-amber-50 text-amber-600" 
          />
          <DashboardCard 
            title="Potencial Venta" 
            value={formatCOP(inventoryValue.valorTotalVenta)} 
            icon={<FaMoneyBillWave />} 
            colorClass="bg-emerald-50 text-emerald-600" 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- FILTROS Y GRÁFICO (2/3 de ancho) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Filtros Modernos */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
              <FaCalendarAlt className="text-emerald-500" /> <h3>Periodo de Análisis</h3>
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Desde</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm" />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Hasta</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm" />
              </div>
              <button onClick={() => {setStartDate(''); setEndDate('');}} className="p-4 bg-gray-100 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                <FaTrashAlt />
              </button>
            </div>
          </div>

          {/* Gráfico de Ventas */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black mb-8 text-gray-900">Rendimiento Mensual</h3>
            <div className="h-[350px] w-full">
              {monthlySalesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="total" radius={[10, 10, 10, 10]} barSize={40}>
                      {monthlySalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === monthlySalesData.length - 1 ? '#10b981' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-medium">Sin datos de ventas en este periodo</div>
              )}
            </div>
          </div>
        </div>

        {/* --- ALERTAS Y TOPS (1/3 de ancho) --- */}
        <div className="space-y-8">
          
          {/* Alerta Bajo Stock */}
          <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                <FaExclamationTriangle />
              </div>
              <h3 className="font-black text-red-900">Stock Crítico</h3>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{p.nombre}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{p.sku}</p>
                  </div>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-black text-xs">{p.stockActual}</span>
                </div>
              )) : (
                <p className="text-red-700 text-sm font-medium">Todo bajo control por ahora.</p>
              )}
            </div>
          </div>

          {/* Top Productos */}
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              🏆 Los más vendidos
            </h3>
            <div className="space-y-6">
              {topSellingProducts.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-black text-xl italic">{i+1}</span>
                    <div>
                      <p className="font-bold text-sm leading-none">{p.productName}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase">{p.totalQuantitySold} ventas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;