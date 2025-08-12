// venta_inventario_app/frontend/src/pages/productos/ProductUploadPage.jsx

import React, { useState } from 'react';
import Papa from 'papaparse'; // Importar Papa Parse
import { uploadProducts } from '../../services/apiService'; // Importar la función de carga masiva
import '../../styles/ProductUpload.css'; // Crearemos este archivo CSS

function ProductUploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadResults, setUploadResults] = useState(null); // Para mostrar resultados detallados
  const [loading, setLoading] = useState(false);

  // Columnas esperadas en el CSV (en el orden que Prisma las espera o las mapea)
  // 'supplierName' es especial, se usará para buscar o crear el proveedor en el backend
  const expectedHeaders = [
    'nombre', 'descripcion', 'sku', 'precioCompra', 'precioVenta',
    'stockActual', 'unidadMedida', 'categoria', 'imagenUrl', 'supplierName',
    // Puedes añadir 'supplierContacto', 'supplierTelefono', 'supplierDireccion'
    // si quieres crear el proveedor con más detalle desde el CSV
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

    // Parsear el archivo CSV
    Papa.parse(file, {
      header: true, // Asume que la primera fila son los encabezados
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Limpia espacios en blanco de los encabezados
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

        // Validación simple de encabezados (puedes hacerla más estricta si es necesario)
        const actualHeaders = Object.keys(productsToUpload[0] || {});
        const missingHeaders = expectedHeaders.filter(header => !actualHeaders.includes(header));
        if (missingHeaders.length > 0) {
          setError(`Faltan las siguientes columnas en el CSV: ${missingHeaders.join(', ')}. Asegúrate de que los encabezados coincidan exactamente.`);
          setLoading(false);
          return;
        }

        try {
          // Llamar a la API de carga masiva
          const response = await uploadProducts(productsToUpload);
          
          setMessage(response.message);
          setUploadResults({
            successCount: response.successCount,
            errorCount: response.errorCount,
            errors: response.errors || [], // Asegurar que sea un array
          });
          setFile(null); // Limpiar el archivo seleccionado
          
        } catch (err) {
          // Si el backend envía un 207 (Multi-Status), el error.message podría contener el JSON de resultados
          let backendErrorData = {};
          try {
            // Intentar parsear el mensaje de error como JSON si viene del backend
            backendErrorData = JSON.parse(err.message); 
          } catch (e) {
            backendErrorData = { error: err.message }; // Si no es JSON, usa el mensaje tal cual
          }

          setError(backendErrorData.error || 'Error al cargar productos. Consulta los detalles abajo.');
          
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
    <div className="product-upload-container">
      <h2>Carga Masiva de Productos (CSV)</h2>
      <p className="upload-instructions">
        Sube un archivo CSV con tus productos. Asegúrate de que las columnas tengan los siguientes encabezados:
        <br/>
        <code>nombre, descripcion, sku, precioCompra, precioVenta, stockActual, unidadMedida, categoria, imagenUrl, supplierName</code>
        <br/>
        (<code>descripcion</code> e <code>imagenUrl</code> son opcionales. <code>supplierName</code> se usará para buscar/crear el proveedor.)
      </p>
      
      <div className="upload-controls">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="csv-file-input"
        />
        <button onClick={handleUpload} disabled={!file || loading} className="upload-button">
          {loading ? 'Cargando...' : 'Subir Productos'}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {uploadResults && (
        <div className="upload-results">
          <h3>Resultados de la Carga</h3>
          <p>Productos Cargados con Éxito: <span className="success-count">{uploadResults.successCount}</span></p>
          <p>Productos con Errores: <span className="error-count">{uploadResults.errorCount}</span></p>

          {uploadResults.errors.length > 0 && (
            <div className="upload-error-details">
              <h4>Detalles de los Errores:</h4>
              <ul className="error-list">
                {uploadResults.errors.map((err, index) => (
                  <li key={index}>
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
