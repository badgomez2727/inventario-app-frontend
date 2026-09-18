// Configuración del catálogo público de la compañía (v1.2): slug, activar
// la vitrina, descripción y foto de portada, números de WhatsApp de venta,
// y si ofrece domicilio. Solo admin_compania/super_admin_sistema (ver ruta
// en App.js).

import React, { useState, useEffect } from 'react';
import { getMiCompania, updateMiCompania, uploadPortadaCatalogo } from '../services/apiService';
import { FaStore, FaWhatsapp, FaTrashAlt, FaPlus, FaTruck, FaCamera, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const CatalogoConfigPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [slug, setSlug] = useState('');
  const [descripcionCatalogo, setDescripcionCatalogo] = useState('');
  const [fotoPortadaCatalogo, setFotoPortadaCatalogo] = useState('');
  const [whatsappVentas, setWhatsappVentas] = useState(['']);
  const [ofreceDomicilio, setOfreceDomicilio] = useState(false);
  const [valorDomicilioDefault, setValorDomicilioDefault] = useState('');
  const [catalogoPublicoActivo, setCatalogoPublicoActivo] = useState(false);
  const [subiendoPortada, setSubiendoPortada] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await getMiCompania();
        setSlug(data.slug || '');
        setDescripcionCatalogo(data.descripcionCatalogo || '');
        setFotoPortadaCatalogo(data.fotoPortadaCatalogo || '');
        setWhatsappVentas(data.whatsappVentas?.length ? data.whatsappVentas : ['']);
        setOfreceDomicilio(data.ofreceDomicilio || false);
        setValorDomicilioDefault(data.valorDomicilioDefault != null ? String(data.valorDomicilioDefault) : '');
        setCatalogoPublicoActivo(data.catalogoPublicoActivo || false);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la configuración.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleWhatsappChange = (index, value) => {
    setWhatsappVentas((prev) => prev.map((n, i) => (i === index ? value : n)));
  };
  const handleAddWhatsapp = () => setWhatsappVentas((prev) => [...prev, '']);
  const handleRemoveWhatsapp = (index) => setWhatsappVentas((prev) => prev.filter((_, i) => i !== index));

  const handlePortadaChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoPortada(true);
    setError(null);
    try {
      const url = await uploadPortadaCatalogo(file);
      setFotoPortadaCatalogo(url);
    } catch (err) {
      setError(err.message || 'No se pudo subir la foto de portada.');
    } finally {
      setSubiendoPortada(false);
    }
  };

  const guardar = async (extra = {}) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        slug,
        descripcionCatalogo,
        fotoPortadaCatalogo,
        whatsappVentas: whatsappVentas.map((n) => n.trim()).filter(Boolean),
        ofreceDomicilio,
        valorDomicilioDefault: ofreceDomicilio && valorDomicilioDefault !== '' ? Number(valorDomicilioDefault) : null,
        ...extra,
      };
      const updated = await updateMiCompania(payload);
      setCatalogoPublicoActivo(updated.catalogoPublicoActivo);
      setSlug(updated.slug || '');
      setMessage('✅ Configuración guardada.');
      return updated;
    } catch (err) {
      setError(err.message || 'No se pudo guardar la configuración.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await guardar();
  };

  const handleToggleActivo = async () => {
    await guardar({ catalogoPublicoActivo: !catalogoPublicoActivo });
  };

  if (loading) return <div className="p-10 text-center text-purple-600 animate-pulse font-bold">Cargando configuración...</div>;

  const urlPublica = slug ? `${window.location.origin}/catalogo/${slug}` : null;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gray-900 rounded-2xl text-purple-500 shadow-lg">
          <FaStore size={24} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            Catálogo <span className="text-purple-600">Público</span>
          </h2>
          <p className="text-gray-500 text-sm">La vitrina en línea de tu negocio, sin login.</p>
        </div>
      </div>

      <div className={`rounded-2xl p-5 flex items-center justify-between gap-4 border ${catalogoPublicoActivo ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
        <div>
          <p className={`font-black text-sm uppercase ${catalogoPublicoActivo ? 'text-emerald-700' : 'text-gray-500'}`}>
            {catalogoPublicoActivo ? 'Catálogo activo' : 'Catálogo desactivado'}
          </p>
          {urlPublica && catalogoPublicoActivo && (
            <a href={urlPublica} target="_blank" rel="noreferrer" className="text-xs text-purple-600 hover:underline break-all">
              {urlPublica}
            </a>
          )}
          {!catalogoPublicoActivo && (
            <p className="text-xs text-gray-400">Configura el identificador y al menos un WhatsApp para poder activarlo.</p>
          )}
        </div>
        <button
          onClick={handleToggleActivo}
          disabled={saving}
          className={`px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 ${
            catalogoPublicoActivo ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {catalogoPublicoActivo ? 'Desactivar' : 'Activar'}
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-center font-medium">{error}</div>}
      {message && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-center font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Identificador del catálogo (slug)</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 whitespace-nowrap">.../catalogo/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tienda-la-esquina"
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Descripción del catálogo</label>
          <textarea
            value={descripcionCatalogo}
            onChange={(e) => setDescripcionCatalogo(e.target.value)}
            rows={3}
            placeholder="Cuéntale a tus clientes qué vendes, horarios, ubicación..."
            className="w-full p-3 mt-1 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Foto de portada</label>
          <div className="flex items-center gap-4">
            {fotoPortadaCatalogo ? (
              <img src={fotoPortadaCatalogo} alt="Portada del catálogo" className="w-24 h-24 rounded-xl object-cover border border-gray-200" />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                <FaCamera size={24} />
              </div>
            )}
            <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-black text-gray-600 cursor-pointer transition-colors">
              {subiendoPortada ? <FaSpinner className="animate-spin inline mr-1" /> : null}
              {subiendoPortada ? 'Subiendo...' : 'Cambiar foto'}
              <input type="file" accept="image/*" onChange={handlePortadaChange} disabled={subiendoPortada} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
            <FaWhatsapp className="text-emerald-500" /> Números de WhatsApp de ventas
          </label>
          <div className="space-y-2">
            {whatsappVentas.map((numero, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="tel"
                  value={numero}
                  onChange={(e) => handleWhatsappChange(index, e.target.value)}
                  placeholder="3001234567"
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                />
                {whatsappVentas.length > 1 && (
                  <button type="button" onClick={() => handleRemoveWhatsapp(index)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg">
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddWhatsapp} className="mt-2 inline-flex items-center gap-1 text-xs font-black text-purple-600 hover:underline">
            <FaPlus size={9} /> Agregar otro número
          </button>
          <p className="text-[10px] text-gray-400 mt-1">El primero de la lista es el que se usa para abrir el pedido en WhatsApp.</p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ofreceDomicilio}
              onChange={(e) => setOfreceDomicilio(e.target.checked)}
              className="w-5 h-5 accent-purple-600"
            />
            <span className="font-bold text-gray-700 text-sm flex items-center gap-2"><FaTruck className="text-purple-500" /> Ofrezco domicilio</span>
          </label>
          {ofreceDomicilio && (
            <div className="mt-3 ml-8">
              <label className="text-xs font-bold text-gray-500 uppercase">Valor del domicilio por defecto</label>
              <input
                type="number"
                min="0"
                step="100"
                value={valorDomicilioDefault}
                onChange={(e) => setValorDomicilioDefault(e.target.value)}
                placeholder="Déjalo vacío si es gratis"
                className="w-full p-3 mt-1 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl text-lg font-bold shadow-lg bg-purple-600 hover:bg-purple-700 text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
          Guardar configuración
        </button>
      </form>
    </div>
  );
};

export default CatalogoConfigPage;
