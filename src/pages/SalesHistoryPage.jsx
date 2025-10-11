import React, { useEffect, useState } from 'react';
import { getSalesHistory, getSaleReceiptPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaDownload } from 'react-icons/fa';

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

  if (loading)
    return <p className="text-center text-gray-600">Cargando historial de ventas...</p>;
  if (error)
    return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;
  if (sales.length === 0)
    return <p className="text-center text-gray-500">No hay ventas registradas para esta compañía.</p>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Historial de Ventas
      </h2>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${
            message.includes('Error') ? 'text-red-500' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow text-xs sm:text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-2 py-2 text-center">ID</th>
              <th className="px-2 py-2 text-left">Usuario</th>
              <th className="px-2 py-2 text-left hidden sm:table-cell">Cliente</th>
              <th className="px-2 py-2 text-center">Fecha Venta</th>
              <th className="px-2 py-2 text-right">Total</th>
              <th className="px-2 py-2 text-center hidden lg:table-cell">Estado</th>
              <th className="px-2 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-center">{sale.id}</td>
                <td className="px-2 py-2">{sale.user?.nombreUsuario || 'N/A'}</td>
                <td className="px-2 py-2 hidden sm:table-cell">{sale.client?.nombre || 'Consumidor Final'}</td>
                <td className="px-2 py-2 text-center">
                  {new Date(sale.fechaVenta).toLocaleDateString('es-CO')}
                </td>
                <td className="px-2 py-2 text-right">{formatCOP(sale.total)}</td>
                <td className="px-2 py-2 text-center hidden lg:table-cell">{sale.estado}</td>
                <td className="px-2 py-2 text-center">
                  <button
                    onClick={() => handleDownloadReceipt(sale.id)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-lg shadow hover:bg-blue-700 transition-colors"
                    title="Descargar Recibo PDF"
                  >
                    <FaDownload /> <span className="hidden sm:inline">Descargar</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesHistoryPage;
