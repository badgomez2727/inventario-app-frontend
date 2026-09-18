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
