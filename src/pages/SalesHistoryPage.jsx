import React, { useEffect, useState } from 'react';
import { getSalesHistory, getSaleReceiptPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaDownload, FaCheckCircle, FaClock } from 'react-icons/fa';

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
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage(`✅ Recibo #${saleId} descargado con éxito.`);
    } catch (err) {
      console.error('Error al descargar el recibo:', err);
      setMessage(`❌ Error al descargar el recibo.`);
    }
  };

  // Función para renderizar el estado con colores
  const renderStatusBadge = (status) => {
    const isPagada = status === 'PAGADA';
    return (
      <span className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase ${
        isPagada ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {isPagada ? <FaCheckCircle /> : <FaClock />}
        {status}
      </span>
    );
  };

  if (loading)
    return <div className="p-10 text-center animate-pulse text-blue-600 font-bold">Cargando historial...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100">
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 text-center tracking-tighter">
        HISTORIAL DE <span className="text-blue-600">VENTAS</span>
      </h2>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-center text-sm font-bold animate-fade-in ${
          message.includes('Error') || message.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-4 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">ID</th>
              <th className="px-4 py-4 text-left text-gray-400 font-black uppercase tracking-widest text-[10px]">Vendedor / Cliente</th>
              <th className="px-4 py-4 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">Fecha</th>
              <th className="px-4 py-4 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">Estado Pago</th>
              <th className="px-4 py-4 text-right text-gray-400 font-black uppercase tracking-widest text-[10px]">Total</th>
              <th className="px-4 py-4 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400 font-medium">No hay ventas registradas.</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-4 text-center font-mono text-gray-400">#{sale.id}</td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-800">{sale.user?.nombreUsuario || 'Sistema'}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-medium">
                      Cliente: {sale.client?.nombre || 'Consumidor Final'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-600">
                    {new Date(sale.fechaVenta).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {renderStatusBadge(sale.estadoPago || sale.estado)}
                  </td>
                  <td className="px-4 py-4 text-right font-black text-gray-900">
                    {formatCOP(sale.total)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleDownloadReceipt(sale.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all shadow-sm active:scale-95"
                    >
                      <FaDownload /> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesHistoryPage;