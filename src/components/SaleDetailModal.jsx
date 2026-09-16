// Detalle de una venta (sin necesidad de descargar el PDF): fecha, cliente,
// usuario que vendió, productos, total y estado de pago. El botón de PDF se
// mantiene como opción dentro del detalle.

import React from 'react';
import { formatCOP } from '../utils/formatters';
import { FaTimes, FaDownload, FaReceipt } from 'react-icons/fa';

const SaleDetailModal = ({ sale, onClose, onDownloadPdf, renderStatusBadge }) => {
  if (!sale) return null;

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
            {renderStatusBadge ? renderStatusBadge(sale.estadoPago || sale.estado) : (
              <span className="text-xs font-bold text-gray-600">{sale.estadoPago || sale.estado}</span>
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

          {/* Total */}
          <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4 px-1">
            <p className="font-black text-gray-500 uppercase text-xs tracking-widest">Total</p>
            <p className="font-black text-xl text-blue-600">{formatCOP(sale.total)}</p>
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
