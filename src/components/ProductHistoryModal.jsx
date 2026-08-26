// venta_inventario_app/frontend/src/components/ProductHistoryModal.jsx
//
// Muestra el historial de cambios de un producto (precios, stock manual,
// nombre, sku, etc.): quién cambió qué, de qué valor a qué valor, y cuándo.
// Alimentado por ProductChangeLog (backend), que se llena solo cada vez que
// se guarda una edición en ProductoForm.

import React, { useEffect, useState } from "react";
import { getProductHistory } from "../services/apiService";
import { formatCOP } from "../utils/formatters";
import { FaHistory, FaTimes, FaArrowRight } from "react-icons/fa";

const CAMPO_LABELS = {
  nombre: "Nombre",
  sku: "SKU",
  precioCompra: "Precio de compra",
  precioVenta: "Precio de venta",
  stockActual: "Stock",
  categoria: "Categoría",
  unidadMedida: "Unidad de medida",
  supplierId: "Proveedor (ID)",
};

const CAMPOS_MONEDA = new Set(["precioCompra", "precioVenta"]);

const formatValor = (campo, valor) => {
  if (valor === null || valor === undefined || valor === "null") return "—";
  if (CAMPOS_MONEDA.has(campo)) return formatCOP(valor);
  return valor;
};

const ProductHistoryModal = ({ product, onClose }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product) return;
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductHistory(product.id);
        setHistorial(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar historial de producto:", err);
        setError(err.message || "No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <FaHistory />
            </div>
            <div>
              <h3 className="font-black text-gray-800 leading-tight">Historial de cambios</h3>
              <p className="text-xs text-gray-400 font-bold">{product.nombre} · SKU {product.sku}</p>
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
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <p className="text-center text-emerald-600 font-bold text-sm py-10 animate-pulse">Cargando historial...</p>
          )}
          {error && (
            <p className="text-center text-red-500 font-medium text-sm py-10">{error}</p>
          )}
          {!loading && !error && historial.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">
              Este producto todavía no tiene cambios registrados.
            </p>
          )}

          {!loading && !error && historial.length > 0 && (
            <ul className="space-y-3">
              {historial.map((h) => (
                <li key={h.id} className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      {CAMPO_LABELS[h.campo] || h.campo}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(h.fecha).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 flex-wrap">
                    <span className="text-gray-400 line-through font-medium">{formatValor(h.campo, h.valorAnterior)}</span>
                    <FaArrowRight className="text-gray-300 text-xs" />
                    <span>{formatValor(h.campo, h.valorNuevo)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Por {h.user?.nombreUsuario || "usuario desconocido"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHistoryModal;
