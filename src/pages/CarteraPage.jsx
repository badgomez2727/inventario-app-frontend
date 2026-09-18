import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartera } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { normalizeText, onlyDigits } from '../utils/normalize';
import { FaWallet, FaExclamationTriangle, FaChevronDown, FaChevronUp, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

// A partir de qué tan vieja es una deuda la resaltamos como urgente.
const DIAS_URGENTE = 30;

function CarteraPage() {
  const navigate = useNavigate();
  const [cartera, setCartera] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCartera = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCartera();
        setCartera(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la cartera.');
      } finally {
        setLoading(false);
      }
    };
    fetchCartera();
  }, []);

  // Ya está todo cargado (la cartera no es una lista paginada), así que el
  // buscador filtra en el navegador — tolerante a mayúsculas/tildes en el
  // nombre y al formato del celular (con o sin +57, espacios o guiones).
  const carteraFiltrada = useMemo(() => {
    if (!search.trim()) return cartera;
    const searchNorm = normalizeText(search);
    const searchDigits = onlyDigits(search);
    return cartera.filter((c) => {
      const nombreMatch = normalizeText(c.nombre).includes(searchNorm);
      const telefonoMatch = searchDigits.length > 0 && onlyDigits(c.telefono).includes(searchDigits);
      return nombreMatch || telefonoMatch;
    });
  }, [cartera, search]);

  const totalGeneral = carteraFiltrada.reduce((sum, c) => sum + c.totalAdeudado, 0);
  const antiguedadMaxima = (cliente) =>
    cliente.ventasPendientes.reduce((max, v) => Math.max(max, v.diasAntiguedad), 0);

  if (loading) return <div className="p-10 text-center text-blue-600 animate-pulse font-bold">Calculando cartera...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gray-900 rounded-2xl text-blue-500 shadow-lg">
          <FaWallet size={24} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            Cartera de <span className="text-blue-600">Clientes</span>
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
            {cartera.length} cliente{cartera.length === 1 ? '' : 's'} con saldo pendiente
          </p>
        </div>
      </div>

      {cartera.length > 0 && (
        <div className="relative max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o celular..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <p className="font-black text-gray-500 uppercase text-xs tracking-widest">Total {search ? 'filtrado' : 'adeudado'}</p>
        <p className="text-2xl font-black text-blue-600">{formatCOP(totalGeneral)}</p>
      </div>

      {cartera.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 font-medium">Ningún cliente tiene ventas pendientes o parciales. Cartera limpia.</p>
        </div>
      ) : carteraFiltrada.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 font-medium">Ningún cliente coincide con "{search}".</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4 text-center">Ventas pendientes</th>
                  <th className="px-6 py-4 text-center">Deuda más antigua</th>
                  <th className="px-6 py-4 text-right">Total adeudado</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {carteraFiltrada.map((c) => {
                  const antiguedad = antiguedadMaxima(c);
                  const urgente = antiguedad >= DIAS_URGENTE;
                  const expandido = expandedId === c.clienteId;
                  return (
                    <React.Fragment key={c.clienteId}>
                      <tr
                        onClick={() => setExpandedId(expandido ? null : c.clienteId)}
                        className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${c.clienteId}`); }}
                            className="font-bold text-gray-800 hover:text-blue-600 inline-flex items-center gap-1.5 text-left"
                          >
                            {c.nombre} <FaExternalLinkAlt size={9} className="text-gray-300" />
                          </button>
                          <p className="text-[10px] text-gray-400">{c.telefono || 'Sin celular'}</p>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-600">
                          {c.ventasPendientes.length}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                            urgente ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {urgente && <FaExclamationTriangle size={9} />}
                            {antiguedad} día{antiguedad === 1 ? '' : 's'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-blue-600">
                          {formatCOP(c.totalAdeudado)}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-400">
                          {expandido ? <FaChevronUp /> : <FaChevronDown />}
                        </td>
                      </tr>
                      {expandido && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50/50">
                            <div className="space-y-2">
                              {c.ventasPendientes.map((v) => (
                                <div key={v.saleId} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100">
                                  <div>
                                    <p className="font-bold text-sm text-gray-700">Venta #{v.saleId}</p>
                                    <p className="text-[10px] text-gray-400">
                                      {new Date(v.fecha).toLocaleDateString('es-CO')} · {v.estadoPago} · {v.diasAntiguedad} día{v.diasAntiguedad === 1 ? '' : 's'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] text-gray-400">Total {formatCOP(v.total)} · Pagado {formatCOP(v.pagado)}</p>
                                    <p className="font-black text-sm text-gray-800">Saldo {formatCOP(v.saldo)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarteraPage;
