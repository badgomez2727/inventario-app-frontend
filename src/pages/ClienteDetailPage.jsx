// Estado de cuenta de un cliente puntual (v1.3): sus datos, saldo total,
// cada venta pendiente/parcial con su detalle, el historial de ventas
// pagadas, y el total histórico comprado. Desde acá se abre el detalle de
// cualquier venta (y se puede registrar un abono) sin ir al historial.

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEstadoCuentaCliente, getSaleById, getSaleReceiptPdf, getEstadoCuentaPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { onlyDigits } from '../utils/normalize';
import SaleDetailModal from '../components/SaleDetailModal';
import { FaArrowLeft, FaPhone, FaMapMarkerAlt, FaWallet, FaHistory, FaCheckCircle, FaClock, FaHourglassHalf, FaBan, FaFilePdf, FaWhatsapp } from 'react-icons/fa';

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
      {style.icon} {status}
    </span>
  );
};

const ClienteDetailPage = () => {
  const { id } = useParams();
  const [estadoCuenta, setEstadoCuenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loadingSale, setLoadingSale] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadingEstado, setDownloadingEstado] = useState(false);

  const fetchEstadoCuenta = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const data = await getEstadoCuentaCliente(id);
      setEstadoCuenta(data);
      setError(null);
    } catch (err) {
      if (!silent) setError(err.message || 'No se pudo cargar el estado de cuenta.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchEstadoCuenta(); }, [fetchEstadoCuenta]);

  const handleOpenSale = async (saleId) => {
    setLoadingSale(true);
    try {
      const sale = await getSaleById(saleId);
      setSelectedSale(sale);
    } catch (err) {
      setMessage(err.message || 'No se pudo cargar la venta.');
    } finally {
      setLoadingSale(false);
    }
  };

  const handleDownloadReceipt = async (saleId) => {
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
    } catch (err) {
      setMessage('❌ Error al descargar el recibo.');
    }
  };

  const handleDownloadEstadoCuenta = async () => {
    setDownloadingEstado(true);
    try {
      const pdfBlob = await getEstadoCuentaPdf(id);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estado_cuenta_${cliente.nombre.trim().replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err.message || 'No se pudo generar el estado de cuenta.');
    } finally {
      setDownloadingEstado(false);
    }
  };

  // El mensaje se abre en WhatsApp (wa.me) ya escrito pero sin enviar — el
  // vendedor lo revisa y lo ajusta ahí antes de mandarlo, no hace falta un
  // editor propio en el panel.
  const buildWhatsappMessage = () => {
    const lineas = ventasPendientes.map(
      (v) => `• Venta #${v.saleId} (${new Date(v.fecha).toLocaleDateString('es-CO')}): saldo ${formatCOP(v.saldo)}`
    );
    return [
      `Hola ${cliente.nombre}, ¿cómo estás? Te escribimos para recordarte amablemente tu saldo pendiente con nosotros.`,
      '',
      `Saldo total: ${formatCOP(saldoTotal)}`,
      '',
      ...lineas,
      '',
      'Cuéntanos cuándo te queda bien para coordinar el pago. ¡Gracias!',
    ].join('\n');
  };

  const handleEnviarWhatsapp = () => {
    if (!cliente.telefono) return;
    const digits = onlyDigits(cliente.telefono);
    const texto = encodeURIComponent(buildWhatsappMessage());
    window.open(`https://wa.me/${digits}?text=${texto}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div className="p-10 text-center text-blue-600 animate-pulse font-bold">Cargando estado de cuenta...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">Error: {error}</div>;
  if (!estadoCuenta) return null;

  const { cliente, saldoTotal, ventasPendientes, historialPagadas, totalHistoricoComprado } = estadoCuenta;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      <Link to="/clientes" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600">
        <FaArrowLeft /> Volver a clientes
      </Link>

      {message && (
        <div className="p-3 rounded-xl text-center text-sm font-bold bg-red-50 text-red-600">{message}</div>
      )}

      {/* Datos del cliente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg flex-shrink-0">
              {cliente.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800">{cliente.nombre}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                {cliente.telefono && <span className="flex items-center gap-1"><FaPhone size={10} /> {cliente.telefono}</span>}
                {cliente.direccion && <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} /> {cliente.direccion}</span>}
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${cliente.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
            {cliente.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-xl px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1"><FaWallet size={10} /> Saldo adeudado</p>
            <p className="text-2xl font-black text-red-600">{formatCOP(saldoTotal)}</p>
          </div>
          <div className="bg-blue-50 rounded-xl px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1"><FaHistory size={10} /> Total histórico comprado</p>
            <p className="text-2xl font-black text-blue-600">{formatCOP(totalHistoricoComprado)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleDownloadEstadoCuenta}
            disabled={downloadingEstado}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl disabled:opacity-50 transition-all active:scale-95"
          >
            <FaFilePdf /> {downloadingEstado ? 'Generando...' : 'Estado de cuenta'}
          </button>
          <button
            onClick={handleEnviarWhatsapp}
            disabled={!cliente.telefono}
            title={!cliente.telefono ? 'Este cliente no tiene celular registrado.' : 'Abre WhatsApp con el mensaje listo para revisar y enviar.'}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <FaWhatsapp /> Enviar por WhatsApp
          </button>
        </div>
        {!cliente.telefono && (
          <p className="text-[10px] text-gray-400 mt-2">Agrega un celular a este cliente para poder enviarle el estado de cuenta por WhatsApp.</p>
        )}
      </div>

      {/* Ventas pendientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Ventas pendientes o parciales</h3>
        </div>
        {ventasPendientes.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">Sin saldo pendiente. 🎉</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {ventasPendientes.map((v) => (
              <button
                key={v.saleId}
                onClick={() => handleOpenSale(v.saleId)}
                disabled={loadingSale}
                className="w-full flex items-center justify-between gap-3 px-6 py-4 hover:bg-blue-50/30 transition-colors text-left"
              >
                <div>
                  <p className="font-bold text-sm text-gray-800">Venta #{v.saleId} — {new Date(v.fecha).toLocaleDateString('es-CO')}</p>
                  <p className="text-[10px] text-gray-400">{v.diasAntiguedad} día{v.diasAntiguedad === 1 ? '' : 's'} · Total {formatCOP(v.total)} · Abonado {formatCOP(v.pagado)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {renderStatusBadge(v.estadoPago)}
                  <p className="font-black text-red-600 text-sm mt-1">{formatCOP(v.saldo)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Historial de ventas pagadas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Historial de ventas pagadas</h3>
        </div>
        {historialPagadas.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">Todavía no tiene ventas pagadas.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {historialPagadas.map((v) => (
              <button
                key={v.saleId}
                onClick={() => handleOpenSale(v.saleId)}
                disabled={loadingSale}
                className="w-full flex items-center justify-between gap-3 px-6 py-4 hover:bg-blue-50/30 transition-colors text-left"
              >
                <p className="font-bold text-sm text-gray-800">Venta #{v.saleId} — {new Date(v.fecha).toLocaleDateString('es-CO')}</p>
                <p className="font-black text-emerald-600 text-sm">{formatCOP(v.total)}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSale && (
        <SaleDetailModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          onDownloadPdf={handleDownloadReceipt}
          renderStatusBadge={renderStatusBadge}
          onPaymentsChanged={() => fetchEstadoCuenta({ silent: true })}
        />
      )}
    </div>
  );
};

export default ClienteDetailPage;
