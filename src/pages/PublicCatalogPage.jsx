// Catálogo público de una compañía (/catalogo/:slug) — sin login, pensado
// para que cualquier cliente lo abra desde un link compartido por
// WhatsApp/redes: arma un carrito, deja sus datos, y al enviar el pedido se
// guarda en el sistema y se abre WhatsApp con el mensaje ya armado.

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCatalogoPublico, crearPedidoPublico } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaStore, FaBoxOpen, FaExternalLinkAlt, FaShoppingCart, FaPlus, FaMinus, FaTimes, FaWhatsapp } from 'react-icons/fa';

const PublicCatalogPage = () => {
  const { slug } = useParams();
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [cart, setCart] = useState([]); // [{ productId, nombre, precioVenta, cantidad, imagen }]
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('RECOGE');
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getCatalogoPublico(slug);
        setCatalogo(data);
      } catch (err) {
        if (err.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogo();
  }, [slug]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existente = prev.find((item) => item.productId === product.id);
      if (existente) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { productId: product.id, nombre: product.nombre, precioVenta: Number(product.precioVenta), cantidad: 1, imagen: product.imagenes[0] }];
    });
  };

  const updateCantidad = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, cantidad: item.cantidad + delta } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.precioVenta * item.cantidad, 0);
  const cartCantidad = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const handleEnviarPedido = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !telefono.trim()) {
      setError('Tu nombre y celular son obligatorios.');
      return;
    }
    if (tipoEntrega === 'DOMICILIO' && !direccionEntrega.trim()) {
      setError('La dirección es obligatoria para domicilio.');
      return;
    }

    setEnviando(true);
    try {
      const resultado = await crearPedidoPublico(slug, {
        items: cart.map((item) => ({ productId: item.productId, cantidad: item.cantidad })),
        cliente: { nombre: nombre.trim(), telefono: telefono.trim() },
        tipoEntrega,
        direccionEntrega: tipoEntrega === 'DOMICILIO' ? direccionEntrega.trim() : undefined,
      });

      if (resultado.whatsappUrl) {
        window.location.href = resultado.whatsappUrl;
      }
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    } catch (err) {
      setError(err.message || 'No se pudo enviar el pedido.');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (notFound || !catalogo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
        <FaBoxOpen size={48} className="text-gray-300" />
        <h1 className="text-xl font-black text-gray-700">Catálogo no encontrado</h1>
        <p className="text-gray-400 text-sm">Este link no corresponde a ningún catálogo activo.</p>
      </div>
    );
  }

  const { company, products } = catalogo;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Portada */}
      <header className="bg-gray-900 text-white">
        {company.fotoPortadaCatalogo && (
          <div className="h-40 md:h-56 w-full overflow-hidden">
            <img src={company.fotoPortadaCatalogo} alt="" className="w-full h-full object-cover opacity-70" />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center flex-shrink-0">
            <FaStore size={20} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black">{company.nombre}</h1>
            {company.descripcionCatalogo && (
              <p className="text-gray-300 text-sm max-w-xl">{company.descripcionCatalogo}</p>
            )}
          </div>
        </div>
      </header>

      {/* Productos */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaBoxOpen size={40} className="mx-auto mb-3" />
            <p className="font-bold">Todavía no hay productos publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const enCarrito = cart.find((item) => item.productId === p.id);
              return (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="aspect-square bg-gray-100 relative">
                    {p.imagenes[0] ? (
                      <img src={p.imagenes[0]} alt={p.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FaBoxOpen size={32} />
                      </div>
                    )}
                    {!p.disponible && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase">
                        Agotado
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <p className="font-bold text-gray-800 text-sm leading-tight flex-1">{p.nombre}</p>
                    {p.categoria && <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">{p.categoria}</p>}
                    <p className="font-black text-purple-600 mt-2">{formatCOP(p.precioVenta)}</p>

                    {p.disponible && (
                      enCarrito ? (
                        <div className="flex items-center justify-between mt-2 bg-purple-50 rounded-xl px-2 py-1.5">
                          <button onClick={() => updateCantidad(p.id, -1)} className="p-1.5 text-purple-600"><FaMinus size={10} /></button>
                          <span className="font-black text-purple-700 text-sm">{enCarrito.cantidad}</span>
                          <button onClick={() => updateCantidad(p.id, 1)} className="p-1.5 text-purple-600"><FaPlus size={10} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(p)}
                          className="mt-2 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl transition-all active:scale-95"
                        >
                          Agregar
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Botón flotante del carrito */}
      {cartCantidad > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3.5 shadow-2xl flex items-center gap-3 font-black text-sm z-40 active:scale-95 transition-all"
        >
          <FaShoppingCart /> {cartCantidad} · {formatCOP(cartTotal)}
        </button>
      )}

      {/* Panel del carrito / checkout */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="font-black text-gray-800 flex items-center gap-2"><FaShoppingCart className="text-purple-600" /> Tu pedido</h3>
              <button onClick={() => { setShowCart(false); setShowCheckout(false); }} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  {item.imagen ? (
                    <img src={item.imagen} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">{item.nombre}</p>
                    <p className="text-xs text-gray-400">{formatCOP(item.precioVenta)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCantidad(item.productId, -1)} className="p-1.5 bg-white rounded-lg text-purple-600 border border-gray-200"><FaMinus size={9} /></button>
                    <span className="font-black text-sm w-4 text-center">{item.cantidad}</span>
                    <button onClick={() => updateCantidad(item.productId, 1)} className="p-1.5 bg-white rounded-lg text-purple-600 border border-gray-200"><FaPlus size={9} /></button>
                  </div>
                </div>
              ))}

              {showCheckout && (
                <form onSubmit={handleEnviarPedido} className="pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">Tu nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">Tu celular</label>
                    <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required
                      placeholder="3001234567"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Entrega</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                      <button type="button" onClick={() => setTipoEntrega('RECOGE')}
                        className={`py-2 rounded-lg text-xs font-black transition-all ${tipoEntrega === 'RECOGE' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>
                        Recoger
                      </button>
                      <button type="button" onClick={() => setTipoEntrega('DOMICILIO')} disabled={!company.ofreceDomicilio}
                        className={`py-2 rounded-lg text-xs font-black transition-all disabled:opacity-30 ${tipoEntrega === 'DOMICILIO' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>
                        Domicilio
                      </button>
                    </div>
                    {!company.ofreceDomicilio && <p className="text-[10px] text-gray-400 mt-1">Esta tienda no ofrece domicilio.</p>}
                  </div>

                  {tipoEntrega === 'DOMICILIO' && (
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase">Dirección de entrega</label>
                      <input type="text" value={direccionEntrega} onChange={(e) => setDireccionEntrega(e.target.value)} required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                      {company.valorDomicilioDefault != null && (
                        <p className="text-[10px] text-gray-400 mt-1">Domicilio: {formatCOP(company.valorDomicilioDefault)}</p>
                      )}
                    </div>
                  )}

                  {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                  <button type="submit" disabled={enviando}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
                    <FaWhatsapp size={18} /> {enviando ? 'Enviando...' : 'Enviar pedido por WhatsApp'}
                  </button>
                </form>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-gray-400 uppercase">Total</span>
                <span className="text-xl font-black text-purple-600">{formatCOP(cartTotal)}</span>
              </div>
              {!showCheckout && (
                <button
                  onClick={() => setShowCheckout(true)}
                  disabled={cart.length === 0}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl disabled:opacity-40 active:scale-95 transition-all"
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pie "Hecho con Vendita" */}
      <footer className="py-6 text-center border-t border-gray-100 bg-white mt-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors">
          Hecho con <span className="text-purple-600">Vendita</span> <FaExternalLinkAlt size={9} />
        </Link>
      </footer>
    </div>
  );
};

export default PublicCatalogPage;
