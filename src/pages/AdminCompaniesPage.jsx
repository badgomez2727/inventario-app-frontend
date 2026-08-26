import React, { useState, useEffect, useCallback } from 'react';
import { getAdminCompanies, updateCompanyPlan } from '../services/apiService';
import { FaCrown, FaChevronLeft, FaChevronRight, FaBuilding } from 'react-icons/fa';

const PLAN_BADGE = {
  FREE: 'bg-gray-100 text-gray-600',
  BASICO: 'bg-blue-100 text-blue-700',
  PRO: 'bg-amber-100 text-amber-700',
};

// Orden en que se ofrecen los planes en el selector (de menor a mayor)
const PLAN_ORDER = ['FREE', 'BASICO', 'PRO'];

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminCompanies(currentPage, 20);
      setCompanies(data.companies || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error('Error al cargar compañías:', err);
      setError(err.message || 'No se pudieron cargar las compañías.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChangePlan = async (company, newPlan) => {
    if (newPlan === company.plan) return;
    if (newPlan !== 'FREE') {
      const confirmMsg = `¿Pasar a "${company.nombre}" al plan ${newPlan}? Vence en 180 días desde hoy (renovable).`;
      if (!window.confirm(confirmMsg)) return;
    }
    setUpdatingId(company.id);
    try {
      await updateCompanyPlan(company.id, newPlan);
      setMessage(`✅ ${company.nombre} pasó a plan ${newPlan}.`);
      fetchCompanies();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el plan.');
    } finally {
      setUpdatingId(null);
    }
  };

  const fmtLimit = (limit) => (limit === null || limit === Infinity ? '∞' : limit);

  if (loading) return <div className="p-10 text-center text-emerald-600 font-bold animate-pulse">Cargando compañías...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gray-900 rounded-2xl text-emerald-500 shadow-lg">
          <FaBuilding size={24} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            Panel de <span className="text-emerald-500">Sistema</span>
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">Total compañías registradas: {totalCount}</p>
        </div>
      </div>

      {message && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-center font-medium">{message}</div>}
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-center font-medium">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Compañía</th>
                <th className="px-6 py-4 hidden md:table-cell">Contacto</th>
                <th className="px-6 py-4 text-center">Plan</th>
                <th className="px-6 py-4 text-center">Vence</th>
                <th className="px-6 py-4 text-center">Productos</th>
                <th className="px-6 py-4 text-center">Usuarios</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{c.nombre}</p>
                    <p className="text-[10px] font-mono text-gray-400">ID: {c.id} · desde {new Date(c.fechaCreacion).toLocaleDateString('es-CO')}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500">{c.emailContacto}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${PLAN_BADGE[c.effectivePlan] || PLAN_BADGE.FREE}`}>
                      {c.effectivePlan === 'PRO' && <FaCrown className="text-amber-500" />}
                      {c.effectivePlan}
                    </span>
                    {c.effectivePlan !== c.plan && (
                      <p className="text-[9px] text-red-400 font-bold mt-1">venció (era {c.plan})</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 text-xs font-medium">
                    {c.planExpiresAt ? new Date(c.planExpiresAt).toLocaleDateString('es-CO') : '—'}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-700">
                    {c.productCount} / {fmtLimit(c.limits?.maxProducts)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500">{c.userCount}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={c.plan}
                      disabled={updatingId === c.id}
                      onChange={(e) => handleChangePlan(c, e.target.value)}
                      className="px-3 py-2 rounded-xl text-[11px] font-black border border-gray-200 bg-white text-gray-700 disabled:opacity-40 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                      {PLAN_ORDER.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            Página <span className="text-emerald-600">{currentPage}</span> de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronLeft /> Anterior
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Siguiente <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCompaniesPage;
