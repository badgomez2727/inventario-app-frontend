// Detalle de una venta (sin necesidad de descargar el PDF): fecha, cliente,
// usuario que vendió, productos, total, estado de pago, y ahora también los
// pagos/abonos registrados con opción de registrar uno nuevo o anularlo.

import React, { useEffect, useState } from 'react';
import { formatCOP } from '../utils/formatters';
import { getSalePayments, registerSalePayment, voidSalePayment } from '../services/apiService';
import { FaTimes, FaDownload, FaReceipt, FaPlus, FaBan } from 'react-icons/fa';

const METODOS = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'NEQUI', label: 'Nequi' },
  { value: 'DAVIPLATA', label: 'Daviplata' },
  { value: 'OTRO', label: 'Otro' },
];

const METODO_LABELS = METODOS.reduce((acc, m) => ({ ...acc, [m.value]: m.label }), {});

const SaleDetailModal = ({ sale, onClose, onDownloadPdf, renderStatusBadge, onPaymentsChanged }) => {
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentsError, setPaymentsError] = useState(null);
  const [estadoPago, setEstadoPago] = useState(sale?.estadoPago);

  const [showForm, setShowForm] = useState(false);
  const [formMonto, setFormMonto] = useState('');
  const [formMetodo, setFormMetodo] = useState('EFECTIVO');
  const [formNota, setFormNota] = useState('');
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [voidingId, setVoidingId] = useState(null);
  const [voidMotivo, setVoidMotivo] = useState('');
  const [voidError, setVoidError] = useState(null);
  const [voidLoading, setVoidLoading] = useState(false);

  useEffect(() => {
    if (!sale) return;
    setEstadoPago(sale.estadoPago);
    setShowForm(false);
    setVoidingId(null);
    setFormError(null);
    setVoidError(null);

    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);
        setPaymentsError(null);
        const data = await getSalePayments(sale.id);
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar los pagos:', err);
        setPaymentsError(err.message || 'No se pudieron cargar los pagos.');
      } finally {
        setLoadingPayments(false);
      }
    };
    fetchPayments();
  }, [sale]);

  if (!sale) return null;

  const totalPagado = payments.filter((p) => !p.anulado).reduce((sum, p) => sum + Number(p.monto), 0);
  const saldo = Number(sale.total) - totalPagado;

  const abrirFormulario = () => {
    setFormError(null);
    setFormMonto(saldo > 0 ? String(saldo) : '');
    setFormMetodo('EFECTIVO');
    setFormNota('');
    setShowForm(true);
  };

  const handleRegistrarPago = async (e) => {
    e.preventDefault();
    setFormError(null);

    const montoNum = Number(formMonto);
    if (!Number.isFinite(montoNum) || montoNum <= 0) {
      setFormError('Ingresa un monto mayor a cero.');
      return;
    }

    setFormLoading(true);
    try {
      const result = await registerSalePayment(sale.id, {
        monto: montoNum,
        metodo: formMetodo,
        nota: formNota.trim() || undefined,
      });
      setPayments((prev) => [...prev, result.payment]);
      setEstadoPago(result.sale.estadoPago);
      setShowForm(false);
      onPaymentsChanged?.();
    } catch (err) {
      setFormError(err.message || 'No se pudo registrar el pago.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAnular = async (paymentId) => {
    if (!voidMotivo.trim()) {
      setVoidError('El motivo de anulación es obligatorio.');
      return;
    }
    setVoidLoading(true);
    setVoidError(null);
    try {
      const result = await voidSalePayment(sale.id, paymentId, voidMotivo.trim());
      setPayments((prev) => prev.map((p) => (p.id === paymentId ? result.payment : p)));
      setEstadoPago(result.sale.estadoPago);
      setVoidingId(null);
      setVoidMotivo('');
      onPaymentsChanged?.();
    } catch (err) {
      setVoidError(err.message || 'No se pudo anular el pago.');
    } finally {
      setVoidLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 text-blue-500 flex items-center justify-center flex-shrink-0">
              <FaReceipt />
            </div>
            <div>
              <h3 className="font-black text-gray-800 leading-tight">Venta #{sale.id}</h3>
              <p className="text-xs text-gray-400 font-bold">
                {new Date(sale.fechaVenta).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Datos generales */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Cliente</p>
              <p className="text-sm font-bold text-gray-800">{sale.client?.nombre || 'Consumidor Final'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Vendedor</p>
              <p className="text-sm font-bold text-gray-800">{sale.user?.nombreUsuario || 'Sistema'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estado de pago</p>
            {renderStatusBadge ? renderStatusBadge(estadoPago) : (
              <span className="text-xs font-bold text-gray-600">{estadoPago}</span>
            )}
          </div>

          {/* Productos */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Productos</p>
            <div className="space-y-2">
              {(sale.saleItems || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">
                      {item.product?.nombre || 'Producto eliminado'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.cantidad} x {formatCOP(item.precioUnitario)}
                    </p>
                  </div>
                  <p className="font-black text-gray-900 text-sm flex-shrink-0">{formatCOP(item.subtotal)}</p>
                </div>
              ))}
              {(!sale.saleItems || sale.saleItems.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-4">Esta venta no tiene productos registrados.</p>
              )}
            </div>
          </div>

          {/* Total y saldo */}
          <div className="border-t-2 border-gray-100 pt-4 px-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-black text-gray-500 uppercase text-xs tracking-widest">Total</p>
              <p className="font-black text-xl text-blue-600">{formatCOP(sale.total)}</p>
            </div>
            {estadoPago !== 'PAGADA' && (
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Saldo pendiente</p>
                <p className="font-black text-sm text-amber-600">{formatCOP(saldo)}</p>
              </div>
            )}
          </div>

          {/* Pagos */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pagos registrados</p>
              {estadoPago !== 'PAGADA' && !showForm && (
                <button
                  onClick={abrirFormulario}
                  className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600 hover:underline uppercase"
                >
                  <FaPlus size={9} /> Registrar pago
                </button>
              )}
            </div>

            {showForm && (
              <form onSubmit={handleRegistrarPago} className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Monto</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formMonto}
                      onChange={(e) => setFormMonto(e.target.value)}
                      required
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Método</label>
                    <select
                      value={formMetodo}
                      onChange={(e) => setFormMetodo(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {METODOS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Nota (opcional)</label>
                  <input
                    type="text"
                    value={formNota}
                    onChange={(e) => setFormNota(e.target.value)}
                    placeholder="Ej. Abono en efectivo"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formError && <p className="text-red-500 text-xs font-bold">{formError}</p>}
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-blue-600 text-white text-xs font-black py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                  >
                    {formLoading ? 'Guardando...' : 'Guardar pago'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 bg-white border border-gray-200 text-gray-500 text-xs font-black py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {loadingPayments && <p className="text-center text-gray-400 text-xs py-4">Cargando pagos...</p>}
            {paymentsError && <p className="text-center text-red-500 text-xs py-2">{paymentsError}</p>}

            {!loadingPayments && !paymentsError && payments.length === 0 && (
              <p className="text-center text-gray-400 text-xs py-4">Todavía no hay pagos registrados.</p>
            )}

            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-xl px-4 py-3 border ${p.anulado ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 shadow-sm'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800">
                        {formatCOP(p.monto)} · {METODO_LABELS[p.metodo] || p.metodo}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(p.fecha).toLocaleDateString('es-CO')} · {p.user?.nombreUsuario || 'Sistema'}
                      </p>
                      {p.nota && <p className="text-xs text-gray-500 mt-1 italic truncate">"{p.nota}"</p>}
                    </div>
                    {p.anulado ? (
                      <span className="text-[10px] font-black text-red-500 uppercase flex-shrink-0">Anulado</span>
                    ) : (
                      <button
                        onClick={() => { setVoidingId(p.id); setVoidMotivo(''); setVoidError(null); }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline flex-shrink-0"
                      >
                        <FaBan size={9} /> Anular
                      </button>
                    )}
                  </div>

                  {p.anulado && p.motivoAnulacion && (
                    <p className="text-[10px] text-red-400 mt-1">Motivo: {p.motivoAnulacion}</p>
                  )}

                  {voidingId === p.id && (
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                      <input
                        type="text"
                        value={voidMotivo}
                        onChange={(e) => setVoidMotivo(e.target.value)}
                        placeholder="Motivo de anulación (obligatorio)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-red-400"
                      />
                      {voidError && <p className="text-red-500 text-[10px] font-bold">{voidError}</p>}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnular(p.id)}
                          disabled={voidLoading}
                          className="flex-1 bg-red-500 text-white text-[10px] font-black py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all"
                        >
                          {voidLoading ? 'Anulando...' : 'Confirmar anulación'}
                        </button>
                        <button
                          onClick={() => setVoidingId(null)}
                          className="px-3 bg-white border border-gray-200 text-gray-500 text-[10px] font-black py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => onDownloadPdf(sale.id)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-black rounded-xl hover:bg-blue-600 transition-all shadow-sm active:scale-95"
          >
            <FaDownload /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailModal;
