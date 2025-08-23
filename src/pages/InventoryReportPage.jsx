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

  if (loading) return <p>Cargando reporte de inventario...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!report) return null;

  return (
    <div className="list-container">
      <h2>Reporte de Valor de Inventario</h2>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Valor Total (Costo)</h3>
          <p style={{ fontSize: '2rem', color: '#3f51b5', fontWeight: 'bold' }}>
            {formatCOP(report.valorTotalCosto)}
          </p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Valor Total (Venta)</h3>
          <p style={{ fontSize: '2rem', color: '#28a745', fontWeight: 'bold' }}>
            {formatCOP(report.valorTotalVenta)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryReportPage;