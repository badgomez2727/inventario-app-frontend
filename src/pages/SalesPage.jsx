// venta_inventario_app/frontend/src/pages/SalesPage.jsx

import React, { useState, useEffect } from 'react';
import { getProducts, createSale, getClients, getSaleReceiptPdf } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaDownload } from 'react-icons/fa';
import '../styles/SalesPage.css'; // <-- Importamos el nuevo CSS

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
        const [productsData, clientsData] = await Promise.all([
          getProducts(),
          getClients(),
        ]);
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
            ? { 
                ...item, 
                cantidad: item.cantidad + 1, 
                subtotal: Number(item.subtotal) + productPrecioVenta 
              }
            : item
        ));
      } else {
        setMessage(`No hay más stock disponible de ${product.nombre}`);
      }
    } else {
      setCart([
        ...cart,
        {
          ...product,
          cantidad: 1,
          subtotal: productPrecioVenta
        }
      ]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newCantidad) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const updatedCantidad = Number(newCantidad);
        const itemPrecioVenta = Number(item.precioVenta);

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

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);
    return total;
  };

  const handleCreateSale = async () => {
    if (cart.length === 0) {
      setMessage('El carrito está vacío.');
      return;
    }
    const saleData = {
      items: cart.map(item => ({
        productId: item.id,
        cantidad: item.cantidad,
      })),
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
      
      if (response && response.sale && response.sale.id) {
        setLastSaleId(response.sale.id);
        setMessage(prev => prev + ' Puedes descargar el recibo ahora.');
      }

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

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="sales-page">
      <h2>Punto de Venta (POS)</h2>
      <div className="sales-content-wrapper"> {/* Usamos la clase CSS aquí */}
        {/* Panel de Productos */}
        <div className="products-panel"> {/* Usamos la clase CSS aquí */}
          <h3>Catálogo de Productos</h3>
          <input
            type="text"
            placeholder="Buscar producto por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="product-search-input" /* Usamos la clase CSS aquí */
          />
          <ul className="product-list"> {/* Usamos la clase CSS aquí */}
            {filteredProducts.map(product => (
              <li
                key={product.id}
                onClick={() => addToCart(product)}
                className="product-item" /* Usamos la clase CSS aquí */
              >
                <div>
                  <strong>{product.nombre}</strong> <br />
                  <small>SKU: {product.sku}</small>
                </div>
                <div>
                  <span className="product-price">{formatCOP(product.precioVenta)}</span>
                  <br/>
                  <small>Stock: {product.stockActual}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel del Carrito */}
        <div className="cart-panel"> {/* Usamos la clase CSS aquí */}
          <h3>Carrito de Venta</h3>
          <div className="client-select-group"> {/* Usamos la clase CSS aquí */}
            <label>Cliente (Opcional):</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="client-select" /* Usamos la clase CSS aquí */
            >
              <option value="">Seleccione un cliente...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </div>
          <ul className="cart-list"> {/* Usamos la clase CSS aquí */}
            {cart.length === 0 ? (
              <p>El carrito está vacío.</p>
            ) : (
              cart.map(item => (
                <li key={item.id} className="cart-item"> {/* Usamos la clase CSS aquí */}
                  <div className="cart-item-info"> {/* Clase para agrupar info */}
                    <strong>{item.nombre}</strong> <br />
                    <small>Cant:
                        <input
                         type="number"
                         min="1"
                         max={item.stockActual}
                         value={item.cantidad}
                         onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                         className="cart-item-quantity-input" /* Usamos la clase CSS aquí */
                       />
                    </small>
                  </div>
                  <div>
                    <span>{formatCOP(item.subtotal)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="remove-from-cart-button">&times;</button>
                  </div>
                </li>
              ))
            )}
          </ul>
          <div className="cart-total-section"> {/* Usamos la clase CSS aquí */}
            <strong>Total: {formatCOP(calculateTotal())}</strong>
          </div>
          <button
            onClick={handleCreateSale}
            disabled={cart.length === 0}
            className="finish-sale-button" /* Usamos la clase CSS aquí */
          >
            Finalizar Venta
          </button>
          {message && <p className={message.includes('Error') ? 'sales-message error-message' : 'sales-message success-message'}>{message}</p>}
          
          {lastSaleId && (
            <button
              onClick={() => handleDownloadReceipt(lastSaleId)}
              className="download-receipt-button" /* Usamos la clase CSS aquí */
              title="Descargar Recibo de la Venta Actual"
            >
              <FaDownload /> Descargar Recibo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
