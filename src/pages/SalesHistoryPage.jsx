// venta_inventario_app/frontend/src/pages/SalesHistoryPage.jsx

import React, { useEffect, useState } from 'react';
import { getSalesHistory, getSaleReceiptPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaDownload } from 'react-icons/fa';
import '../styles/SalesHistoryPage.css'; // <-- Importamos el nuevo CSS

function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSalesHistory();
        setSales(data);
      } catch (err) {
        console.error('Error fetching sales history:', err);
        setError(err.message || 'No se pudo cargar el historial de ventas.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleDownloadReceipt = async (saleId) => {
    setMessage('');
    try {
      const pdfBlob = await getSaleReceiptPdf(saleId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo_venta_${saleId}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage(`Recibo para la venta ${saleId} descargado con éxito.`);
    } catch (err) {
      console.error('Error al descargar el recibo:', err);
      setMessage(err.message || `Error al descargar el recibo para la venta ${saleId}.`);
    }
  };

  if (loading) return <p>Cargando historial de ventas...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (sales.length === 0) return <p>No hay ventas registradas para esta compañía.</p>;

  return (
    <div className="sales-history-container"> {/* Contenedor principal */}
      <h2>Historial de Ventas</h2>
      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
      
      <table className="sales-history-table"> {/* Añadimos una clase para el nuevo CSS */}
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Usuario</th>
            <th>Cliente</th>
            <th>Fecha Venta</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td data-label="ID Venta">{sale.id}</td> {/* Añadimos data-label */}
              <td data-label="Usuario">{sale.user?.nombreUsuario || 'N/A'}</td>
              <td data-label="Cliente">{sale.client?.nombre || 'Consumidor Final'}</td>
              <td data-label="Fecha Venta">{new Date(sale.fechaVenta).toLocaleDateString('es-CO')}</td>
              <td data-label="Total">{formatCOP(sale.total)}</td>
              <td data-label="Estado">{sale.estado}</td>
              <td data-label="Acciones">
                <button
                  onClick={() => handleDownloadReceipt(sale.id)}
                  className="action-button stock-button"
                  title="Descargar Recibo PDF"
                >
                  <FaDownload /> Descargar Recibo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesHistoryPage;
