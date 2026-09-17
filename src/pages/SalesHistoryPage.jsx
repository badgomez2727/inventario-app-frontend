import React, { useEffect, useState } from 'react';
import { getSalesHistory, getSaleReceiptPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaDownload, FaCheckCircle, FaClock, FaHourglassHalf, FaChevronLeft, FaChevronRight, FaBan } from 'react-icons/fa';
import SaleDetailModal from '../components/SaleDetailModal';

function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // silent=true se usa para refrescar en segundo plano (ej. tras registrar/anular
  // un pago desde el modal de detalle) sin mostrar la pantalla de carga ni
  // cerrar el modal que está abierto encima de la tabla.
  const fetchSales = async (page, { silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      const data = await getSalesHistory(page, 10);
      let list = [];
      if (data && data.sales) {
        list = data.sales;
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } else {
        // Por si el backend aún devuelve el formato antiguo (array plano)
        list = Array.isArray(data) ? data : [];
      }
      setSales(list);
      setSelectedSale((prev) => {
        if (!prev) return prev;
        return list.find((s) => s.id === prev.id) || prev;
      });
    } catch (err) {
      console.error('Error fetching sales history:', err);
      if (!silent) setError(err.message || 'No se pudo cargar el historial de ventas.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
  const STATUS_STYLES = {
    PAGADA: { cls: 'bg-green-100 text-green-700', icon: <FaCheckCircle /> },
    PARCIAL: { cls: 'bg-amber-100 text-amber-700', icon: <FaHourglassHalf /> },
    PENDIENTE: { cls: 'bg-red-100 text-red-600', icon: <FaClock /> },
    ANULADA: { cls: 'bg-gray-200 text-gray-600', icon: <FaBan /> },
  };
  const renderStatusBadge = (status) => {
    const style = STATUS_STYLES[status] || STATUS_STYLES.PENDIENTE;
    return (
      <span className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase ${style.cls}`}>
        {style.icon}
        {status}
      </span>
    );
  };

  // Saldo pendiente de una venta = total menos la suma de sus pagos activos
  // (getSalesHistory ya trae solo los pagos NO anulados en `sale.payments`).
  const calcularSaldo = (sale) => {
    const pagado = (sale.payments || []).reduce((sum, p) => sum + Number(p.monto), 0);
    return Number(sale.total) - pagado;
  };

  // Las ventas anuladas se excluyen de los totales (siguen visibles en la
  // tabla con su badge, pero no cuentan como valor de ventas).
  const pageTotal = sales
    .filter((sale) => sale.estado !== 'ANULADA')
    .reduce((sum, sale) => sum + Number(sale.total), 0);

  if (loading)
    return <div className="p-10 text-center animate-pulse text-blue-600 font-bold">Cargando historial...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100">
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 text-center tracking-tighter">
        HISTORIAL DE <span className="text-blue-600">VENTAS</span>
      </h2>
      <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-tighter mb-6">
        Total registradas: {totalCount}
      </p>

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
                <tr
                  key={sale.id}
                  onClick={() => setSelectedSale(sale)}
                  className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${sale.estado === 'ANULADA' ? 'opacity-60' : ''}`}
                >
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
                    {sale.estado === 'ANULADA' ? renderStatusBadge('ANULADA') : renderStatusBadge(sale.estadoPago || sale.estado)}
                    {sale.estado !== 'ANULADA' && sale.estadoPago && sale.estadoPago !== 'PAGADA' && (
                      <div className="text-[10px] text-gray-400 font-bold mt-1 whitespace-nowrap">
                        Saldo: {formatCOP(calcularSaldo(sale))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-black text-gray-900">
                    {formatCOP(sale.total)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(sale.id); }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all shadow-sm active:scale-95"
                    >
                      <FaDownload /> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sales.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50/50">
                <td colSpan="4" className="px-4 py-4 text-right font-black text-gray-500 uppercase text-[10px] tracking-widest">
                  Total de esta página
                </td>
                <td className="px-4 py-4 text-right font-black text-blue-600">{formatCOP(pageTotal)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      <div className="mt-4 px-2 py-4 flex items-center justify-between border-t border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
          Página <span className="text-blue-600">{currentPage}</span> de {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FaChevronLeft /> Anterior
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Siguiente <FaChevronRight />
          </button>
        </div>
      </div>

      {selectedSale && (
        <SaleDetailModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          onDownloadPdf={handleDownloadReceipt}
          renderStatusBadge={renderStatusBadge}
          onPaymentsChanged={() => fetchSales(currentPage, { silent: true })}
        />
      )}
    </div>
  );
}

export default SalesHistoryPage;