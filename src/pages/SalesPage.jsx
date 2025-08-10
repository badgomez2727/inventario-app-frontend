// venta_inventario_app/frontend/src/pages/SalesPage.jsx

import React, { useState, useEffect } from 'react';
import { getProducts, createSale, getClients } from '../services/apiService';
import { formatCOP } from '../utils/formatters';

function SalesPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [clients, setClients] = useState([]); // Nuevo estado para la lista de clientes
  const [selectedClient, setSelectedClient] = useState(''); // Nuevo estado para el cliente seleccionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

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
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.cantidad < product.stockActual) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1, subtotal: item.subtotal + product.precioVenta }
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
          subtotal: product.precioVenta
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
        if (newCantidad > item.stockActual) {
            setMessage(`No hay más stock disponible de ${item.nombre}`);
            return item;
        }
        return {
          ...item,
          cantidad: newCantidad,
          subtotal: newCantidad * item.precioVenta
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
      // Añadimos el cliente solo si uno ha sido seleccionado
      clientId: selectedClient || null,
      total: calculateTotal(),
    };

    try {
      await createSale(saleData);
      setMessage('Venta registrada con éxito.');
      setCart([]);
      setSearchTerm('');
      setSelectedClient(''); // Limpiamos el cliente seleccionado
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (err) {
      console.error('Error al crear la venta:', err);
      setMessage(err.message || 'Error al registrar la venta.');
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
                           onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
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
          {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
