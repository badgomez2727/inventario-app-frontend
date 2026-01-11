import React, { useState, useEffect } from 'react';
import { getProducts, createSale, getClients, getSaleReceiptPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaDownload } from 'react-icons/fa';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, clientsData] = await Promise.all([getProducts(), getClients()]);
        setProducts(productsData);
        setClients(clientsData);
      } catch (err) {
        setError('No se pudieron cargar los datos.');
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            ? { ...item, cantidad: item.cantidad + 1, subtotal: Number(item.subtotal) + productPrecioVenta }
            : item
        ));
      } else {
        setMessage(`No hay más stock disponible de ${product.nombre}`);
      }
    } else {
      setCart([...cart, { ...product, cantidad: 1, subtotal: productPrecioVenta }]);
    }
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item.id !== productId));

  const updateQuantity = (productId, newCantidad) => {
  setCart(cart.map(item => {
    if (item.id === productId) {
      // Si el usuario borró el número, dejamos cantidad vacía para que pueda escribir
      if (newCantidad === "") {
        return { ...item, cantidad: "", subtotal: 0 };
      }

      const updatedCantidad = Number(newCantidad);
      const itemPrecioVenta = Number(item.precioVenta);

      // Validación de stock
      if (updatedCantidad > item.stockActual) {
          setMessage(`No hay más stock disponible de ${item.nombre}`);
          return item;
        }

        return { 
          ...item, 
          cantidad: updatedCantidad, 
          subtotal: updatedCantidad * itemPrecioVenta 
        };
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
      items: cart.map(item => ({ productId: item.id, cantidad: item.cantidad })),
      clientId: selectedClient ? Number(selectedClient) : null,
      total: calculateTotal(),
    };

    try {
      setLastSaleId(null);
      const response = await createSale(saleData);
      setMessage('Venta registrada con éxito.');
      setCart([]);
      setSearchTerm('');
      setSelectedClient('');
      if (response?.sale?.id) setLastSaleId(response.sale.id);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (err) {
      console.error('Error al crear la venta:', err);
      setMessage(err.message || 'Error al registrar la venta.');
      setLastSaleId(null);
    }
  };

  const handleDownloadReceipt = async (saleId) => {
    setMessage('');
    try {
      const pdfBlob = await getSaleReceiptPdf(saleId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo_venta_${saleId}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage(`Recibo para la venta ${saleId} descargado con éxito.`);
    } catch (err) {
      console.error('Error al descargar el recibo:', err);
      setMessage(err.message || `Error al descargar el recibo para la venta ${saleId}.`);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Cargando productos...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Punto de Venta (POS)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel Productos */}
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Catálogo de Productos</h3>
          <input
            type="text"
            placeholder="Buscar producto por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring focus:ring-blue-200"
          />
          <ul className="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
            {filteredProducts.map(product => (
              <li key={product.id}
                  onClick={() => addToCart(product)}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <div>
                  <strong>{product.nombre}</strong>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatCOP(product.precioVenta)}</span>
                  <p className="text-xs text-gray-400">Stock: {product.stockActual}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel Carrito */}
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Carrito de Venta</h3>
          {/* Cliente */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cliente (Opcional):</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seleccione un cliente...</option>
              {clients.map(client => <option key={client.id} value={client.id}>{client.nombre}</option>)}
            </select>
          </div>

          {/* Items del carrito */}
          <ul className="space-y-2 flex-1 overflow-y-auto max-h-[400px] mb-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">El carrito está vacío.</p>
            ) : (
              cart.map(item => (
                <li key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <strong>{item.nombre}</strong>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      Cant:
                      <input
                        type="number"
                        min="1"
                        max={item.stockActual}
                        value={item.cantidad}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 border border-gray-300 rounded-md px-2 py-1"
                      />
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-semibold">{formatCOP(item.subtotal)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700 mt-1"
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="flex justify-between items-center mb-4 font-semibold">
            <span>Total:</span>
            <span>{formatCOP(calculateTotal())}</span>
          </div>

          <button
            onClick={handleCreateSale}
            disabled={cart.length === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 mb-2"
          >
            Finalizar Venta
          </button>

          {message && (
            <p className={`mt-1 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          {lastSaleId && (
            <button
              onClick={() => handleDownloadReceipt(lastSaleId)}
              className="mt-2 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
              title="Descargar Recibo de la Venta Actual"
            >
              <FaDownload /> <span>Descargar Recibo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
