// venta_inventario_app/frontend/src/pages/InventoryReportPage.jsx

import React, { useEffect, useState } from 'react';
import { getInventoryValue } from '../services/apiService';
import { formatCOP } from '../utils/formatters';

const InventoryReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInventoryValue();
        setReport(data);
      } catch (err) {
        console.error('Error al cargar el reporte de inventario:', err);
        setError(err.message || 'No se pudo cargar el reporte de inventario.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Cargando reporte de inventario...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;
  if (!report) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Reporte de Valor de Inventario
      </h2>

      <div className="flex flex-col md:flex-row gap-6 justify-center mt-6">
        <div className="flex-1 max-w-sm bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-gray-700">Valor Total (Costo)</h3>
          <p className="text-3xl text-indigo-600 font-bold mt-3">
            {formatCOP(report.valorTotalCosto)}
          </p>
        </div>

        <div className="flex-1 max-w-sm bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-gray-700">Valor Total (Venta)</h3>
          <p className="text-3xl text-green-600 font-bold mt-3">
            {formatCOP(report.valorTotalVenta)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryReportPage;
