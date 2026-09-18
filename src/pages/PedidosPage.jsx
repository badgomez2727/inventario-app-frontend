// Panel de pedidos del catálogo público: revisarlos y decidir — confirmar
// (crea la venta real, PENDIENTE de pago, con su cliente) o rechazar (con
// motivo). No requiere admin, es trabajo operativo normal.

import React, { useState, useEffect, useCallback } from 'react';
import { getPedidos, confirmarPedido, rechazarPedido } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaClipboardList, FaCheckCircle, FaBan, FaMapMarkerAlt, FaStore, FaUser, FaPhone } from 'react-icons/fa';

const TABS = [
  { value: 'PENDIENTE_REVISION', label: 'Pendientes' },
  { value: 'CONFIRMADO', label: 'Confirmados' },
  { value: 'RECHAZADO', label: 'Rechazados' },
];

const PedidosPage = () => {
  const [tab, setTab] = useState('PENDIENTE_REVISION');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [rechazandoId, setRechazandoId] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPedidos(tab, 1, 50);
      setPedidos(data.pedidos || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchPedidos(); }, [fetchPedidos]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleConfirmar = async (pedido) => {
    if (!window.confirm(`¿Confirmar el pedido #${pedido.id}? Esto crea la venta y descuenta el stock.`)) return;
    setProcesandoId(pedido.id);
    setError(null);
    try {
      await confirmarPedido(pedido.id);
      setMessage(`✅ Pedido #${pedido.id} confirmado — venta creada.`);
      fetchPedidos();
    } catch (err) {
      setError(err.message || 'No se pudo confirmar el pedido.');
    } finally {
      setProcesandoId(null);
    }
  };

  const handleRechazar = async (pedidoId) => {
    if (!motivoRechazo.trim()) {
      setError('El motivo de rechazo es obligatorio.');
      return;
    }
    setProcesandoId(pedidoId);
    setError(null);
    try {
      await rechazarPedido(pedidoId, motivoRechazo.trim());
      setMessage(`Pedido #${pedidoId} rechazado.`);
      setRechazandoId(null);
      setMotivoRechazo('');
      fetchPedidos();
    } catch (err) {
      setError(err.message || 'No se pudo rechazar el pedido.');
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gray-900 rounded-2xl text-purple-500 shadow-lg">
          <FaClipboardList size={24} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            Pedidos del <span className="text-purple-600">Catálogo</span>
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">{pedidos.length} en esta vista</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              tab === t.value ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-center font-medium">{message}</div>}
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-center font-medium">{error}</div>}

      {loading ? (
        <div className="p-10 text-center text-purple-600 animate-pulse font-bold">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
          <FaClipboardList className="mx-auto text-gray-300 text-4xl mb-3" />
          <p className="text-gray-400 font-medium">No hay pedidos en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-black text-gray-800">Pedido #{pedido.id}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(pedido.fechaPedido).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <p className="font-black text-purple-600 text-lg">{formatCOP(pedido.total)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <FaUser className="text-gray-400 flex-shrink-0" size={12} />
                  <span className="text-xs font-bold text-gray-700 truncate">{pedido.client?.nombre}</span>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <FaPhone className="text-gray-400 flex-shrink-0" size={11} />
                  <span className="text-xs font-bold text-gray-700">{pedido.client?.telefono}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
                {pedido.tipoEntrega === 'DOMICILIO' ? <FaMapMarkerAlt className="text-purple-500 flex-shrink-0" size={12} /> : <FaStore className="text-purple-500 flex-shrink-0" size={12} />}
                <span className="text-xs font-bold text-gray-700">
                  {pedido.tipoEntrega === 'DOMICILIO' ? `Domicilio — ${pedido.direccionEntrega}` : 'Recoger en el negocio'}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {pedido.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{item.cantidad}x {item.product?.nombre}</span>
                    <span className="font-bold text-gray-800">{formatCOP(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {pedido.estado === 'RECHAZADO' && pedido.motivoRechazo && (
                <p className="text-[10px] text-red-500 mb-2">Motivo: {pedido.motivoRechazo}</p>
              )}

              {pedido.estado === 'PENDIENTE_REVISION' && (
                <div className="pt-3 border-t border-gray-100">
                  {rechazandoId === pedido.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={motivoRechazo}
                        onChange={(e) => setMotivoRechazo(e.target.value)}
                        placeholder="Motivo de rechazo (obligatorio)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-red-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRechazar(pedido.id)}
                          disabled={procesandoId === pedido.id}
                          className="flex-1 bg-red-500 text-white text-xs font-black py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          Confirmar rechazo
                        </button>
                        <button
                          onClick={() => { setRechazandoId(null); setMotivoRechazo(''); }}
                          className="px-4 bg-white border border-gray-200 text-gray-500 text-xs font-black py-2 rounded-lg hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmar(pedido)}
                        disabled={procesandoId === pedido.id}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 text-white text-xs font-black py-2.5 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <FaCheckCircle /> Confirmar
                      </button>
                      <button
                        onClick={() => { setRechazandoId(pedido.id); setMotivoRechazo(''); setError(null); }}
                        disabled={procesandoId === pedido.id}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-500 text-xs font-black py-2.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <FaBan /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosPage;
