import { analizarProductosCsv, COLUMNAS, COLUMNAS_OBLIGATORIAS, COLUMNAS_OPCIONALES } from './csvProducts';

const filaCompleta = (nombre) => ({
  nombre, sku: 'A1', precioCompra: '1000', precioVenta: '1500', stockActual: '10', unidadMedida: 'unidad', categoria: 'Aseo',
});

describe('columnas del archivo de carga masiva', () => {
  test('supplierName es opcional (el backend no lo exige)', () => {
    expect(COLUMNAS_OBLIGATORIAS).not.toContain('supplierName');
    expect(COLUMNAS_OPCIONALES).toContain('supplierName');
  });

  test('toda columna es obligatoria u opcional, sin repetirse', () => {
    expect([...COLUMNAS_OBLIGATORIAS, ...COLUMNAS_OPCIONALES].sort()).toEqual([...COLUMNAS].sort());
  });
});

describe('analizarProductosCsv', () => {
  test('cuenta los productos y muestra los primeros nombres', () => {
    const rows = ['Jabón', 'Arroz', 'Aceite', 'Sal'].map(filaCompleta);
    const analisis = analizarProductosCsv({ fields: Object.keys(rows[0]), rows });
    expect(analisis.total).toBe(4);
    expect(analisis.faltantes).toEqual([]);
    expect(analisis.muestra).toEqual(['Jabón', 'Arroz', 'Aceite']);
  });

  test('avisa qué columnas obligatorias faltan', () => {
    const analisis = analizarProductosCsv({ fields: ['nombre', 'sku'], rows: [{ nombre: 'X', sku: '1' }] });
    expect(analisis.faltantes).toEqual(['precioCompra', 'precioVenta', 'stockActual', 'unidadMedida', 'categoria']);
  });

  test('un archivo sin supplierName ni columnas opcionales es válido', () => {
    const analisis = analizarProductosCsv({ fields: Object.keys(filaCompleta('X')), rows: [filaCompleta('X')] });
    expect(analisis.faltantes).toEqual([]);
  });

  test('tolera espacios en los nombres de columna', () => {
    const fields = [' nombre ', 'sku', 'precioCompra ', 'precioVenta', 'stockActual', 'unidadMedida', 'categoria'];
    expect(analizarProductosCsv({ fields, rows: [] }).faltantes).toEqual([]);
  });

  test('un archivo vacío devuelve total 0', () => {
    expect(analizarProductosCsv({ fields: COLUMNAS, rows: [] }).total).toBe(0);
  });

  test('ignora filas sin nombre en la muestra', () => {
    const analisis = analizarProductosCsv({ fields: COLUMNAS, rows: [{ nombre: '' }, { nombre: 'Café' }] });
    expect(analisis.muestra).toEqual(['Café']);
  });
});
