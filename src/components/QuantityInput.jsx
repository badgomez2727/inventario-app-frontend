// Selector de cantidad del catálogo público: botones −/+ y un campo donde
// también se puede escribir el número directamente (ej. pedir 24 sin tocar
// "+" veinte veces).

import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

// El stock exacto no se publica, así que no se puede limitar a lo que hay;
// este tope solo evita cantidades absurdas por un dedazo. Si piden más de lo
// que hay, el backend lo rechaza al enviar el pedido con un mensaje claro.
export const MAX_CANTIDAD = 999;

const VARIANTS = {
  card: {
    container: 'flex items-center justify-between bg-purple-50 rounded-xl px-2 py-1.5',
    button: 'p-2 text-purple-600',
    input: 'w-14 text-center font-black text-purple-700 bg-transparent outline-none',
  },
  cart: {
    container: 'flex items-center gap-1.5',
    button: 'p-2 bg-white rounded-lg text-purple-600 border border-gray-200',
    input: 'w-12 text-center font-black text-gray-800 bg-white border border-gray-200 rounded-lg py-1 outline-none focus:ring-2 focus:ring-purple-500',
  },
};

// `onChange(n)` recibe la cantidad exacta (1..MAX_CANTIDAD); `onRemove()` se
// llama al bajar de 1 con "−" o al dejar el campo en 0.
const QuantityInput = ({ value, onChange, onRemove, variant = 'card' }) => {
  const styles = VARIANTS[variant];
  // null = no se está editando (se muestra el valor real). Mientras se
  // escribe, se guarda lo tecleado para poder dejar el campo vacío un
  // momento sin que el número "salte" de vuelta.
  const [draft, setDraft] = useState(null);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    const n = parseInt(digits, 10);
    if (n > 0) {
      const clamped = Math.min(n, MAX_CANTIDAD);
      setDraft(String(clamped));
      onChange(clamped);
    } else {
      setDraft(digits);
    }
  };

  // Vacío = se borró sin querer: vuelve al número anterior. 0 escrito a
  // propósito = quitar el producto.
  const handleBlur = () => {
    if (draft !== null && draft !== '' && parseInt(draft, 10) === 0) {
      onRemove();
    }
    setDraft(null);
  };

  const step = (delta) => {
    setDraft(null);
    const next = value + delta;
    if (next <= 0) onRemove();
    else onChange(Math.min(next, MAX_CANTIDAD));
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={() => step(-1)} className={styles.button} aria-label="Quitar uno">
        <FaMinus size={10} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft !== null ? draft : String(value)}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        onBlur={handleBlur}
        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
        aria-label="Cantidad"
        // 16px (text-base): con menos, Safari en iPhone hace zoom al enfocar el campo.
        className={`${styles.input} text-base`}
      />
      <button type="button" onClick={() => step(1)} disabled={value >= MAX_CANTIDAD} className={`${styles.button} disabled:opacity-30`} aria-label="Agregar uno">
        <FaPlus size={10} />
      </button>
    </div>
  );
};

export default QuantityInput;
