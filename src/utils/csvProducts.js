// Columnas del archivo de carga masiva de productos y el análisis previo que
// se muestra al elegir el archivo (antes de subirlo).

// Orden de la plantilla descargable.
export const COLUMNAS = [
  'nombre', 'descripcion', 'sku', 'precioCompra', 'precioVenta',
  'stockActual', 'unidadMedida', 'categoria', 'imagenUrl', 'supplierName',
  'supplierContacto', 'supplierTelefono', 'supplierDireccion',
];

// El backend solo exige estas (supplierName es opcional: un negocio puede no
// tener proveedores registrados).
export const COLUMNAS_OBLIGATORIAS = [
  'nombre', 'sku', 'precioCompra', 'precioVenta', 'stockActual', 'unidadMedida', 'categoria',
];

export const COLUMNAS_OPCIONALES = COLUMNAS.filter((c) => !COLUMNAS_OBLIGATORIAS.includes(c));

// `fields`: nombres de columna del archivo; `rows`: filas ya leídas con
// encabezado. Devuelve cuántos productos trae, cuáles columnas obligatorias
// faltan y los primeros nombres como muestra.
export const analizarProductosCsv = ({ fields = [], rows = [] }) => {
  const presentes = fields.map((f) => String(f).trim());
  return {
    total: rows.length,
    faltantes: COLUMNAS_OBLIGATORIAS.filter((c) => !presentes.includes(c)),
    muestra: rows
      .slice(0, 3)
      .map((r) => String(r.nombre || '').trim())
      .filter(Boolean),
  };
};
