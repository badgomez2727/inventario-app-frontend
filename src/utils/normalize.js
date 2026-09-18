// Normalización de texto para búsquedas tolerantes a mayúsculas y tildes
// (mismo criterio que el buscador de clientes del backend — ver
// backend/src/utils/text.js), usada donde el filtro se hace en el
// navegador sobre datos que ya están cargados (ej. Cartera).

export const normalizeText = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .trim();

export const onlyDigits = (str) => (str || '').replace(/\D/g, '');

// Heurística simple de plural en español (agregan "s" o "es") para que
// buscar "camisa" encuentre "Camisas" y viceversa, sin necesitar una
// librería de lematización para un caso tan acotado.
const singularize = (word) => {
  if (word.length > 4 && word.endsWith('es')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s')) return word.slice(0, -1);
  return word;
};

// Compara un texto (ej. el nombre de un producto) contra una búsqueda de
// una o varias palabras: cada palabra de la búsqueda debe aparecer (como
// sub-cadena, y tolerando singular/plural) en alguna palabra del texto.
// Tolerante a mayúsculas y tildes vía normalizeText.
export const matchesSearch = (texto, busqueda) => {
  const palabrasBusqueda = normalizeText(busqueda).split(/\s+/).filter(Boolean).map(singularize);
  if (palabrasBusqueda.length === 0) return true;

  const palabrasTexto = normalizeText(texto).split(/\s+/).filter(Boolean).map(singularize);

  return palabrasBusqueda.every((pb) => palabrasTexto.some((pt) => pt.includes(pb) || pb.includes(pt)));
};
