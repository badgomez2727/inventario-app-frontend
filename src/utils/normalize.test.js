import { matchesSearch } from './normalize';

describe('matchesSearch (buscador del catálogo público)', () => {
  test.each([
    ['Camisa Roja', 'camisas', true],
    ['Camisas Rojas', 'camisa', true],
    ['Jabón Líquido', 'JABON', true],
    ['Jabón Líquido', 'liquidos', true],
    ['Pantalón', 'pantalones', true],
    ['Pantalones', 'pantalon', true],
    ['Camisa Roja', 'ROJA camisa', true],
    ['Camisa', 'camisa roja', false],
    ['Botella', 'pantalon', false],
    ['Gaseosa', '', true],
    ['Arroz', '   ', true],
  ])('%s con la búsqueda "%s" -> %s', (nombre, busqueda, esperado) => {
    expect(matchesSearch(nombre, busqueda)).toBe(esperado);
  });
});
