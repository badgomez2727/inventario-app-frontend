// venta_inventario_app/frontend/src/pages/productos/ProductUploadPage.jsx

import React, { useState } from 'react';
import Papa from 'papaparse';
import { uploadProducts } from '../../services/apiService';

function ProductUploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadResults, setUploadResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const expectedHeaders = [
    'nombre', 'descripcion', 'sku', 'precioCompra', 'precioVenta',
    'stockActual', 'unidadMedida', 'categoria', 'imagenUrl', 'supplierName',
    'supplierContacto', 'supplierTelefono', 'supplierDireccion'
  ];

  const handleFileChange = (e) => {
    setError('');
    setMessage('');
    setUploadResults(null);
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo CSV.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setUploadResults(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: async (results) => {
        const productsToUpload = results.data;
        const parseErrors = results.errors;

        if (parseErrors.length > 0) {
          setError('Errores al parsear el CSV. Verifica el formato de las filas.');
          console.error('Errores de PapaParse:', parseErrors);
          setLoading(false);
          return;
        }

        if (productsToUpload.length === 0) {
          setError('El archivo CSV está vacío o no contiene datos válidos.');
          setLoading(false);
          return;
        }

        const actualHeaders = Object.keys(productsToUpload[0] || {});
        const missingHeaders = expectedHeaders.filter(header => !actualHeaders.includes(header));
        const optionalHeaders = ['descripcion', 'imagenUrl', 'supplierContacto', 'supplierTelefono', 'supplierDireccion'];
        const trulyMissingHeaders = missingHeaders.filter(h => !optionalHeaders.includes(h));

        if (trulyMissingHeaders.length > 0) {
          setError(`Faltan columnas obligatorias: ${trulyMissingHeaders.join(', ')}.`);
          setLoading(false);
          return;
        }

        try {
          const response = await uploadProducts(productsToUpload);
          setMessage(response.message);
          setUploadResults({
            successCount: response.successCount,
            errorCount: response.errorCount,
            errors: response.errors || [],
          });
          setFile(null);
        } catch (err) {
          let backendErrorData = {};
          try {
            backendErrorData = JSON.parse(err.message);
          } catch (e) {
            backendErrorData = { error: err.message || 'Error desconocido.' };
          }

          setError(backendErrorData.error || 'Error al cargar productos.');
          setUploadResults({
            successCount: backendErrorData.successCount || 0,
            errorCount: backendErrorData.errorCount || (backendErrorData.errors ? backendErrorData.errors.length : 0),
            errors: backendErrorData.errors || [],
          });
        } finally {
          setLoading(false);
        }
      },
      error: (err, file, inputElem, reason) => {
        setError(`Error al leer el archivo: ${reason}`);
        console.error('Error PapaParse:', err);
        setLoading(false);
      }
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Carga Masiva de Productos (CSV)</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Sube un archivo CSV con tus productos. Encabezados requeridos:
        <br />
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
          nombre, descripcion, sku, precioCompra, precioVenta, stockActual, unidadMedida, categoria, imagenUrl, supplierName, supplierContacto, supplierTelefono, supplierDireccion
        </code>
        <br />
        <span className="text-gray-500">Algunas columnas como <code>descripcion</code>, <code>imagenUrl</code>, <code>supplierContacto</code>, <code>supplierTelefono</code>, <code>supplierDireccion</code> son opcionales.</span>
      </p>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Cargando...' : 'Subir'}
        </button>
      </div>

      {message && <p className="text-green-600 font-medium mb-4">{message}</p>}
      {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

      {uploadResults && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Resultados de la Carga</h3>
          <p>✅ Productos cargados: <span className="font-bold">{uploadResults.successCount}</span></p>
          <p>❌ Errores: <span className="font-bold text-red-600">{uploadResults.errorCount}</span></p>

          {uploadResults.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-red-700 mb-2">Detalles de los Errores:</h4>
              <ul className="space-y-2 text-sm">
                {uploadResults.errors.map((err, index) => (
                  <li key={index} className="p-2 bg-red-50 border border-red-200 rounded">
                    <strong>Fila:</strong> {JSON.stringify(err.rowData)} <br />
                    <strong>Error:</strong> {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductUploadPage;
