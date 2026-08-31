import React, { useState, useEffect } from 'react';
import { getProducts, getClients, createSale, parseWhatsappOrder } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaWhatsapp, FaMagic, FaExclamationTriangle, FaTrash, FaPlus, FaCrown } from 'react-icons/fa';

function WhatsappOrderPage() {
  const [texto, setTexto] = useState('');
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [planBlocked, setPlanBlocked] = useState(false);
  const [message, setMessage] = useState('');

  const [draft, setDraft] = useState(null); // { cliente, items, total }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCatalog(true);
        const [productsData, clientsData] = await Promise.all([
          getProducts(1, 1000),
          getClients(1, 1000),
        ]);
        setProducts(productsData.products || []);
        setClients(clientsData.clients || []);
      } catch (err) {
        console.error('Error cargando catálogo/clientes:', err);
      } finally {
        setLoadingCatalog(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!texto.trim()) {
      setError('Pega el mensaje del pedido antes de generar el borrador.');
      return;
    }
    setError(null);
    setPlanBlocked(false);
    setMessage('');
    setGenerating(true);
    try {
      const result = await parseWhatsappOrder(texto);
      setDraft(result);
    } catch (err) {
      // El backend responde este código cuando la compañía no está en PRO.
      if (err.message && err.message.includes('exclusiva del plan Pro')) {
        setPlanBlocked(true);
      } else {
        setError(err.message || 'No se pudo generar el borrador. Intenta de nuevo.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const updateItem = (index, changes) => {
    setDraft((prev) => {
      const items = prev.items.map((item, i) => (i === index ? { ...item, ...changes } : item));
      const total = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
      return { ...prev, items, total };
    });
  };

  const handleReassignProduct = (index, productId) => {
    const product = products.find((p) => p.id === Number(productId));
    if (!product) return;
    const item = draft.items[index];
    const precioUnitario = Number(product.precioVenta);
    updateItem(index, {
      productoId: product.id,
      nombreProducto: product.nombre,
      stockDisponible: product.stockActual,
      precioUnitario,
      subtotal: precioUnitario * item.cantidad,
      sinCoincidencia: false,
    });
  };

  const handleQuantityChange = (index, cantidad) => {
    const item = draft.items[index];
    const cant = cantidad === '' ? '' : Math.max(1, Number(cantidad) || 1);
    updateItem(index, {
      cantidad: cant,
      subtotal: (cant === '' ? 0 : cant) * item.precioUnitario,
    });
  };

  const handleRemoveItem = (index) => {
    setDraft((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      const total = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
      return { ...prev, items, total };
    });
  };

  const handleAddManualItem = () => {
    if (products.length === 0) return;
    const first = products[0];
    setDraft((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          textoOriginal: '(agregado manualmente)',
          confianza: 'alta',
          cantidad: 1,
          productoId: first.id,
          nombreProducto: first.nombre,
          stockDisponible: first.stockActual,
          precioUnitario: Number(first.precioVenta),
          subtotal: Number(first.precioVenta),
          sinCoincidencia: false,
        },
      ],
    }));
  };

  const handleCreateSale = async () => {
    const validItems = draft.items.filter((item) => item.productoId && Number(item.cantidad) > 0);
    if (validItems.length === 0) {
      setMessage('No hay ítems válidos para crear la venta. Asigna un producto a cada línea.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const saleData = {
        items: validItems.map((item) => ({ productId: item.productoId, cantidad: Number(item.cantidad) })),
        clientId: selectedClient ? Number(selectedClient) : null,
        total: validItems.reduce((sum, item) => sum + Number(item.subtotal), 0),
        estadoPago: 'PAGADA',
      };
      await createSale(saleData);
      setMessage('✅ Venta creada con éxito a partir del pedido.');
      setDraft(null);
      setTexto('');
      setSelectedClient('');
      const updatedProducts = await getProducts(1, 1000);
      setProducts(updatedProducts.products || []);
    } catch (err) {
      setMessage(err.message || 'Error al crear la venta.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingCatalog) return <div className="p-10 text-center animate-pulse text-blue-600">Cargando catálogo...</div>;

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-black mb-2 text-gray-800 text-center uppercase tracking-tighter flex items-center justify-center gap-2">
        <FaWhatsapp className="text-emerald-500" /> Pedido desde WhatsApp
        <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-black uppercase">
          <FaCrown size={10} /> Pro
        </span>
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6">Pega el mensaje que te mandó el cliente y genera un borrador de venta automático.</p>

      <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6">
        {/* PASO 1: PEGAR MENSAJE */}
        <div className="bg-white shadow-xl rounded-2xl p-5 border border-gray-100">
          <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Mensaje del cliente</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={5}
            placeholder="Ej: Hola buenas! me regala 2 gaseosas grandes y una bolsa de arroz, me lo envía a la casa de siempre, soy Marta 3001234567"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all shadow-sm resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white py-3 rounded-xl font-black uppercase text-sm tracking-tighter transition-all"
          >
            <FaMagic /> {generating ? 'Generando borrador...' : 'Generar borrador con IA'}
          </button>

          {planBlocked && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-start gap-2">
              <FaCrown className="mt-0.5 flex-shrink-0" />
              <span>Esta función es exclusiva del plan <strong>Pro</strong>. Actualiza tu plan para generar borradores de pedidos automáticamente.</span>
            </div>
          )}
          {error && !planBlocked && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <FaExclamationTriangle /> {error}
            </div>
          )}
        </div>

        {/* PASO 2: REVISAR BORRADOR */}
        {draft && (
          <div className="bg-white shadow-2xl rounded-2xl p-5 border-2 border-emerald-50">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 border-b pb-2 flex-wrap">
              <span className="bg-emerald-600 text-white p-1.5 rounded-lg text-xs">REVISA ANTES DE CONFIRMAR</span>
              {draft.simulado && (
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase">Modo demo</span>
              )}
            </h3>

            {(draft.cliente?.nombre || draft.cliente?.telefono) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                <strong>Cliente detectado:</strong> {draft.cliente.nombre || 'sin nombre'} {draft.cliente.telefono && `· ${draft.cliente.telefono}`}
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Asociar a cliente registrado (opcional)</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="">Consumidor Final</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-3 mb-4">
              {draft.items.map((item, index) => (
                <div key={index} className={`p-3 rounded-xl border ${item.sinCoincidencia ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-xs text-gray-400 italic mb-2">"{item.textoOriginal}"</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={item.productoId || ''}
                      onChange={(e) => handleReassignProduct(index, e.target.value)}
                      className={`flex-1 min-w-[160px] border rounded-lg px-2 py-2 text-sm ${item.sinCoincidencia ? 'border-red-300 text-red-600 font-bold' : 'border-gray-200'}`}
                    >
                      {item.sinCoincidencia && <option value="">Sin coincidencia — elige un producto</option>}
                      {products.map((p) => <option key={p.id} value={p.id}>{p.nombre} ({p.sku})</option>)}
                    </select>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={item.cantidad}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      onBlur={() => (item.cantidad === '' || item.cantidad <= 0) && handleQuantityChange(index, 1)}
                      className="w-14 h-9 bg-white border border-gray-200 rounded-lg text-center font-bold text-emerald-600 text-sm"
                    />
                    <span className="text-sm font-bold text-gray-700 w-28 text-right">{formatCOP(item.subtotal)}</span>
                    <button onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 p-2">
                      <FaTrash size={12} />
                    </button>
                  </div>
                  {item.sinCoincidencia && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><FaExclamationTriangle size={10} /> No encontramos coincidencia clara en tu catálogo, elige el producto correcto.</p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddManualItem}
              className="mb-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-300 py-2.5 rounded-xl text-xs font-bold uppercase"
            >
              <FaPlus size={10} /> Agregar producto manual
            </button>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total</span>
                <span className="text-2xl font-black text-emerald-700">{formatCOP(draft.total)}</span>
              </div>

              <button
                onClick={handleCreateSale}
                disabled={saving || draft.items.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-200 transition-all transform active:scale-95 disabled:bg-gray-200 disabled:shadow-none uppercase tracking-tighter"
              >
                {saving ? 'Creando venta...' : 'Confirmar y Crear Venta'}
              </button>

              {message && (
                <div className={`text-center p-3 rounded-xl text-sm font-bold ${message.includes('Error') || message.includes('No hay') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatsappOrderPage;
