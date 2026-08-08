import React, { useState, useEffect } from 'react';
import { getProducts, createSale, getClients, getSaleReceiptPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaDownload, FaShoppingCart, FaUser, FaCheckCircle, FaClock } from 'react-icons/fa';

const LOW_STOCK_THRESHOLD = 5;

function SalesPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [lastSaleId, setLastSaleId] = useState(null);
  
  // Estado para el tipo de pago
  const [paymentStatus, setPaymentStatus] = useState('PAGADA'); 

  // Carga inicial de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // (1, 1000) asegura que tengamos el catálogo/lista completa para buscar localmente,
        // en vez de solo la primera página de 10 que trae el backend paginado.
        const [productsData, clientsData] = await Promise.all([
          getProducts(1, 1000),
          getClients(1, 1000)
        ]);

        // Accedemos a .products / .clients porque el backend ahora es paginado
        setProducts(productsData.products || []);
        setClients(clientsData.clients || []);
      } catch (err) {
        setError('No se pudieron cargar los datos de productos o clientes.');
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtro de búsqueda local
  const filteredProducts = products.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const productPrecioVenta = Number(product.precioVenta); 
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.cantidad < product.stockActual) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, cantidad: Number(item.cantidad) + 1, subtotal: (Number(item.cantidad) + 1) * productPrecioVenta }
            : item
        ));
      } else {
        setMessage(`No hay más stock disponible de ${product.nombre}`);
      }
    } else {
      if (product.stockActual > 0) {
        setCart([...cart, { ...product, cantidad: 1, subtotal: productPrecioVenta }]);
        setMessage('');
      } else {
        setMessage(`Producto sin stock.`);
      }
    }
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item.id !== productId));

  const updateQuantity = (productId, newCantidad) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        if (newCantidad === "") return { ...item, cantidad: "", subtotal: 0 };
        const updatedCantidad = Number(newCantidad);
        const itemPrecioVenta = Number(item.precioVenta);
        
        if (updatedCantidad > item.stockActual) {
          setMessage(`Solo hay ${item.stockActual} disponibles`);
          return item;
        }
        return { ...item, cantidad: updatedCantidad, subtotal: updatedCantidad * itemPrecioVenta };
      }
      return item;
    }));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + Number(item.subtotal), 0);

  const handleCreateSale = async () => {
    if (cart.length === 0) {
      setMessage('El carrito está vacío.');
      return;
    }
    const saleData = {
      items: cart.map(item => ({ productId: item.id, cantidad: Number(item.cantidad) })),
      clientId: selectedClient ? Number(selectedClient) : null,
      total: calculateTotal(),
      estadoPago: paymentStatus,
    };

    try {
      setLastSaleId(null);
      const response = await createSale(saleData);
      setMessage(`✅ Venta ${paymentStatus === 'PAGADA' ? 'Cobrada' : 'Registrada como Pendiente'} con éxito.`);
      setCart([]);
      setSearchTerm('');
      setSelectedClient('');
      setPaymentStatus('PAGADA');
      
      if (response?.sale?.id) setLastSaleId(response.sale.id);

      // Actualizar stock local después de la venta
      const updatedProducts = await getProducts(1, 1000);
      setProducts(updatedProducts.products || []);
    } catch (err) {
      setMessage(err.message || 'Error al registrar la venta.');
    }
  };

  const handleDownloadReceipt = async (saleId) => {
    try {
      const pdfBlob = await getSaleReceiptPdf(saleId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo_venta_${saleId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setMessage(`Error al descargar recibo.`);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-blue-600">Cargando catálogo de venta...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-black mb-6 text-gray-800 text-center uppercase tracking-tighter">
        VENDITA <span className="text-blue-600">POS</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO: PRODUCTOS */}
        <div className="lg:col-span-7 bg-white shadow-xl rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-gray-700">
            <FaShoppingCart className="text-blue-600" />
            <h3 className="font-bold uppercase text-sm">Catálogo de Productos</h3>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-4 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
          <ul className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[500px] pr-2">
            {filteredProducts.map(product => (
              <li key={product.id}
                  onClick={() => addToCart(product)}
                  className="flex justify-between items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-blue-200 group">
                <div>
                  <strong className="text-gray-800 group-hover:text-blue-700">{product.nombre}</strong>
                  <p className="text-xs text-gray-400 font-mono tracking-widest">{product.sku}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600 block">{formatCOP(product.precioVenta)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${product.stockActual < LOW_STOCK_THRESHOLD ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    Stock: {product.stockActual}
                  </span>
                </div>
              </li>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-400 py-10">No se encontraron productos.</p>
            )}
          </ul>
        </div>

        {/* PANEL DERECHO: CARRITO */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white shadow-2xl rounded-2xl p-5 border-2 border-blue-50">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 border-b pb-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg text-xs">RESUMEN DE VENTA</span>
            </h3>

            {/* Selector de Cliente */}
            <div className="mb-6">
              <label className="text-xs font-black text-gray-400 uppercase mb-2 block flex items-center gap-1">
                <FaUser size={10} /> Seleccionar Cliente
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="">Consumidor Final (Opcional)</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.nombre}</option>)}
              </select>
            </div>

            {/* Listado de Items en Carrito */}
            <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                  <FaShoppingCart size={40} className="mx-auto mb-2" />
                  <p className="text-sm font-bold uppercase">Carrito Vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700 leading-tight">{item.nombre}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.cantidad}
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                          onBlur={(e) => (e.target.value === "" || Number(e.target.value) <= 0) && updateQuantity(item.id, 1)}
                          className="w-12 h-8 bg-white border border-gray-200 rounded-lg text-center font-bold text-blue-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="text-[10px] font-bold text-gray-400">x {formatCOP(item.precioVenta)}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-sm text-gray-800">{formatCOP(item.subtotal)}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs font-bold mt-1 uppercase">Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* TOTAL Y ESTADO DE PAGO */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total a Cobrar</span>
                <span className="text-2xl font-black text-blue-700">{formatCOP(calculateTotal())}</span>
              </div>

              {/* SELECTOR DE ESTADO DE PAGO */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setPaymentStatus('PAGADA')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all ${paymentStatus === 'PAGADA' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                >
                  <FaCheckCircle /> PAGADA
                </button>
                <button
                  onClick={() => setPaymentStatus('PENDIENTE')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all ${paymentStatus === 'PENDIENTE' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}
                >
                  <FaClock /> PENDIENTE
                </button>
              </div>

              <button
                onClick={handleCreateSale}
                disabled={cart.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:bg-gray-200 disabled:shadow-none uppercase tracking-tighter"
              >
                {paymentStatus === 'PAGADA' ? 'Finalizar y Cobrar' : 'Registrar como Deuda'}
              </button>

              {message && (
                <div className={`text-center p-3 rounded-xl text-sm font-bold ${message.includes('Error') || message.includes('No hay') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600 animate-pulse'}`}>
                  {message}
                </div>
              )}

              {lastSaleId && (
                <button
                  onClick={() => handleDownloadReceipt(lastSaleId)}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl hover:bg-black transition-all font-bold text-sm"
                >
                  <FaDownload /> Descargar Recibo #{lastSaleId}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesPage;