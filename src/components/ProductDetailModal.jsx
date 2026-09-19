// Detalle de un producto del catálogo público: galería con todas sus fotos
// (flechas, deslizar con el dedo y miniaturas), descripción, precio,
// disponibilidad y el mismo control de cantidad/"Agregar" que la tarjeta.

import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaBoxOpen } from 'react-icons/fa';
import { formatCOP } from '../utils/formatters';
import QuantityInput from './QuantityInput';

const SWIPE_MIN_PX = 40;

const ProductDetailModal = ({ product, cantidad, onClose, onAdd, onChangeCantidad, onRemove }) => {
  const imagenes = product.imagenes || [];
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const go = (delta) => {
    if (imagenes.length < 2) return;
    setIndex((i) => (i + delta + imagenes.length) % imagenes.length);
  };

  // Escape cierra, flechas cambian de foto; y mientras está abierto, la
  // página de atrás no se desplaza.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowPrevio;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, imagenes.length]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) >= SWIPE_MIN_PX) go(diff < 0 ? 1 : -1);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.nombre}
        className="bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
      >
        {/* Galería */}
        <div
          className="relative bg-gray-100 aspect-square md:aspect-[4/3] flex items-center justify-center select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {imagenes.length > 0 ? (
            <img src={imagenes[index]} alt={product.nombre} className="w-full h-full object-contain" draggable={false} />
          ) : (
            <FaBoxOpen size={56} className="text-gray-300" />
          )}

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 p-2.5 bg-white/90 hover:bg-white rounded-full shadow text-gray-600"
          >
            <FaTimes />
          </button>

          {imagenes.length > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Foto anterior" className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow text-gray-600">
                <FaChevronLeft size={12} />
              </button>
              <button onClick={() => go(1)} aria-label="Foto siguiente" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow text-gray-600">
                <FaChevronRight size={12} />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                {index + 1} / {imagenes.length}
              </span>
            </>
          )}
        </div>

        {imagenes.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 pt-3" style={{ scrollbarWidth: 'none' }}>
            {imagenes.map((url, i) => (
              <button
                key={url}
                onClick={() => setIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 ${i === index ? 'border-purple-600' : 'border-transparent opacity-70'}`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Información */}
        <div className="p-5 space-y-3">
          <div>
            {product.categoria && <p className="text-[10px] text-gray-400 uppercase font-bold">{product.categoria}</p>}
            <h2 className="text-lg font-black text-gray-800 leading-tight">{product.nombre}</h2>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-black text-purple-600">{formatCOP(product.precioVenta)}</p>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${product.disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
              {product.disponible ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          {product.descripcion && (
            <p className="text-sm text-gray-600 whitespace-pre-line">{product.descripcion}</p>
          )}

          {product.disponible && (
            cantidad > 0 ? (
              <QuantityInput value={cantidad} onChange={onChangeCantidad} onRemove={onRemove} variant="card" />
            ) : (
              <button
                onClick={onAdd}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl transition-all active:scale-95"
              >
                Agregar al pedido
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
