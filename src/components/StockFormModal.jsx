// venta_inventario_app/frontend/src/components/StockFormModal.jsx
import React, { useState } from 'react';
import { addStockEntry, addStockExit } from '../services/apiService';

// Estilos básicos para el modal (puedes ajustarlos en tu CSS)
const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  maxWidth: '450px',
  width: '100%',
};

function StockFormModal({ product, onClose, onStockUpdated }) {
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const data = {
      productId: product.id,
      cantidad: parseInt(cantidad),
      motivo,
    };

    try {
      if (type === 'ENTRADA') {
        await addStockEntry(data);
        setMessage(`Entrada de stock de ${cantidad} unidades registrada con éxito.`);
      } else {
        await addStockExit(data);
        setMessage(`Salida de stock de ${cantidad} unidades registrada con éxito.`);
      }
      // Opcional: limpiar el formulario después de un envío exitoso
      setCantidad('');
      setMotivo('');
      // Llamar a la función para que el componente padre actualice la lista
      onStockUpdated();
    } catch (err) {
      console.error('Error al registrar movimiento de stock:', err);
      setError(err.message || 'Error al registrar el movimiento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <h2>Gestión de Stock: {product.nombre}</h2>
        <p>Stock actual: <strong>{product.stockActual}</strong></p>
        <form>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              required
            />
          </div>
          <div>
            <label>Motivo:</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Compra a proveedor, Venta, Daño"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={(e) => handleSubmit(e, 'ENTRADA')}
              type="button"
              disabled={loading || cantidad <= 0}
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
            >
              Registrar Entrada
            </button>
            <button
              onClick={(e) => handleSubmit(e, 'SALIDA')}
              type="button"
              disabled={loading || cantidad <= 0}
              style={{ backgroundColor: '#f44336', color: 'white' }}
            >
              Registrar Salida
            </button>
            <button
              onClick={onClose}
              type="button"
              style={{ backgroundColor: '#ccc' }}
            >
              Cerrar
            </button>
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default StockFormModal;