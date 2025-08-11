// venta_inventario_app/frontend/src/pages/SalesHistoryPage.jsx

import React, { useEffect, useState } from 'react';
import { getSalesHistory, getSaleReceiptPdf } from '../services/apiService'; // Importación correcta
import { formatCOP } from '../utils/formatters'; // Asumiendo que tienes formatCOP
import { FaDownload } from 'react-icons/fa'; // Importamos el ícono de descarga

function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Para mensajes al usuario

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSalesHistory(); // Llamada a la función correcta
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
    setMessage(''); // Limpiar mensajes anteriores
    try {
      // 1. Llamar a la API para obtener el Blob del PDF
      const pdfBlob = await getSaleReceiptPdf(saleId);

      // 2. Crear una URL para el Blob
      const url = window.URL.createObjectURL(pdfBlob);

      // 3. Crear un elemento 'a' para la descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo_venta_${saleId}.pdf`; // Nombre del archivo
      a.target = '_blank'; // Abrir en una nueva pestaña (opcional, pero útil para PDF)

      // 4. Simular un clic para iniciar la descarga
      document.body.appendChild(a);
      a.click();

      // 5. Limpiar (revocar la URL del objeto Blob)
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
    <div>
      <h2>Historial de Ventas</h2>
      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Usuario</th>
            <th>Cliente</th>
            <th>Fecha Venta</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th> {/* Nueva columna para el botón de descarga */}
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.user?.nombreUsuario || 'N/A'}</td>
              <td>{sale.client?.nombre || 'Consumidor Final'}</td>
              <td>{new Date(sale.fechaVenta).toLocaleDateString('es-CO')}</td>
              <td>{formatCOP(sale.total)}</td>
              <td>{sale.estado}</td>
              <td>
                <button
                  onClick={() => handleDownloadReceipt(sale.id)}
                  className="action-button stock-button" // Puedes reutilizar o crear una nueva clase CSS
                  title="Descargar Recibo PDF"
                >
                  <FaDownload />
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
