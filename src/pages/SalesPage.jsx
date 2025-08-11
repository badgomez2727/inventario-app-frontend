// venta_inventario_app/frontend/src/pages/SalesPage.jsx

import React, { useState, useEffect } from 'react';
import { getProducts, createSale, getClients, getSaleReceiptPdf } from '../services/apiService'; // Importamos getSaleReceiptPdf
import { formatCOP } from '../utils/formatters';
import { FaDownload } from 'react-icons/fa'; // Importamos el ícono de descarga

function SalesPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [clients, setClients] = useState([]); // Nuevo estado para la lista de clientes
  const [selectedClient, setSelectedClient] = useState(''); // Nuevo estado para el cliente seleccionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [lastSaleId, setLastSaleId] = useState(null); // Nuevo estado para guardar el ID de la última venta

  // Efecto para cargar productos y clientes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, clientsData] = await Promise.all([
          getProducts(),
          getClients(), // <-- Nueva llamada para obtener clientes
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
    // Asegurarse de que el precio de venta sea un número
    const productPrecioVenta = Number(product.precioVenta); 

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.cantidad < product.stockActual) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                cantidad: item.cantidad + 1, 
                // Asegurar que el subtotal actual también sea un número antes de sumar
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
          subtotal: productPrecioVenta // El primer subtotal es simplemente el precio
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
        // Asegurarse de que newCantidad sea un número y el precio de venta también
        const updatedCantidad = Number(newCantidad);
        const itemPrecioVenta = Number(item.precioVenta);

        if (updatedCantidad > item.stockActual) {
            setMessage(`No hay más stock disponible de ${item.nombre}`);
            return item;
        }
        return {
          ...item,
          cantidad: updatedCantidad,
          subtotal: updatedCantidad * itemPrecioVenta // Multiplicación con números
        };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    // Asegurarse de que el subtotal de cada item sea un número al reducir
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
      clientId: selectedClient ? Number(selectedClient) : null, // Asegurarse de que clientId sea un número o null
      total: calculateTotal(),
    };

    try {
      setLastSaleId(null); // Limpiamos el ID de la venta anterior
      const response = await createSale(saleData); // Guardamos la respuesta del backend
      setMessage('Venta registrada con éxito.');
      setCart([]);
      setSearchTerm('');
      setSelectedClient(''); // Limpiamos el cliente seleccionado
      
      // Si el backend devuelve el ID de la venta, lo guardamos para la descarga del PDF
      if (response && response.sale && response.sale.id) {
        setLastSaleId(response.sale.id);
        setMessage(prev => prev + ' Puedes descargar el recibo ahora.');
      }

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (err) {
      console.error('Error al crear la venta:', err);
      setMessage(err.message || 'Error al registrar la venta.');
      setLastSaleId(null); // Asegurarse de limpiar el ID si falla
    }
  };

  // Nueva función para descargar el recibo (similar a SalesHistoryPage)
  const handleDownloadReceipt = async (saleId) => {
    setMessage(''); // Limpiar mensajes anteriores
    try {
      const pdfBlob = await getSaleReceiptPdf(saleId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo_venta_${saleId}.pdf`;
      a.target = '_blank'; // Abrir en una nueva pestaña
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
      <h2 style={{ textAlign: 'center' }}>Punto de Venta (POS)</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Panel de Productos */}
        <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '20px' }}>
          <h3>Catálogo de Productos</h3>
          <input
            type="text"
            placeholder="Buscar producto por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
          />
          <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '600px', overflowY: 'auto' }}>
            {filteredProducts.map(product => (
              <li
                key={product.id}
                onClick={() => addToCart(product)}
                style={{
                  padding: '10px',
                  border: '1px solid #eee',
                  marginBottom: '5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <strong>{product.nombre}</strong> <br />
                  <small>SKU: {product.sku}</small>
                </div>
                <div>
                  <span style={{ color: 'green', fontWeight: 'bold' }}>{formatCOP(product.precioVenta)}</span>
                  <br/>
                  <small>Stock: {product.stockActual}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel del Carrito */}
        <div style={{ flex: 1 }}>
          <h3>Carrito de Venta</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Cliente (Opcional):</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
            >
              <option value="">Seleccione un cliente...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {cart.length === 0 ? (
              <p>El carrito está vacío.</p>
            ) : (
              cart.map(item => (
                <li key={item.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{item.nombre}</strong> <br />
                      <small>Cant:
                          <input
                           type="number"
                           min="1"
                           max={item.stockActual}
                           value={item.cantidad}
                           // Asegurar que el valor del input sea un número entero
                           onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} 
                           style={{ width: '50px', marginLeft: '5px' }}
                         />
                      </small>
                    </div>
                    <div>
                      <span>{formatCOP(item.subtotal)}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px', color: 'red' }}>&times;</button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
          <div style={{ marginTop: '20px', borderTop: '2px solid black', paddingTop: '10px' }}>
            <strong>Total: {formatCOP(calculateTotal())}</strong>
          </div>
          <button
            onClick={handleCreateSale}
            disabled={cart.length === 0}
            style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', fontSize: '1.2rem', border: 'none', cursor: 'pointer', marginTop: '15px' }}
          >
            Finalizar Venta
          </button>
          {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
          
          {lastSaleId && (
            <button
              onClick={() => handleDownloadReceipt(lastSaleId)}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#007bff',
                color: 'white',
                fontSize: '1.2rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
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
