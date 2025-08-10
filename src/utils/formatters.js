// venta_inventario_app/frontend/src/utils/formatters.js

/**
 * Formats a number as Colombian Pesos (COP) without decimal places.
 * @param {number} number The number to format.
 * @returns {string} The formatted currency string.
 */
export const formatCOP = (number) => {
  if (typeof number !== 'number') {
    return 'N/A';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};
