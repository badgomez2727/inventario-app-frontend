import React, { useState } from 'react';
import Papa from 'papaparse';
import { uploadProducts } from '../../services/apiService';
import { whatsappLink } from '../../config/contact';
import { COLUMNAS, COLUMNAS_OBLIGATORIAS, COLUMNAS_OPCIONALES, analizarProductosCsv } from '../../utils/csvProducts';
import { FaCloudUploadAlt, FaFileCsv, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaDownload, FaWhatsapp } from 'react-icons/fa';

const MSG_AYUDA = 'Hola, necesito ayuda para crear mi archivo de carga masiva de productos en Vendita.';

function ProductUploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadResults, setUploadResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filas, setFilas] = useState([]);
  const [analisis, setAnalisis] = useState(null);

  // Al elegir el archivo se lee de una vez, para mostrar qué trae (cuántos
  // productos, primeros nombres, columnas que faltan) ANTES de subirlo — en el
  // celular no hay dónde abrir un CSV para revisarlo.
  const handleFileChange = (e) => {
    setError('');
    setMessage('');
    setUploadResults(null);
    setFilas([]);
    setAnalisis(null);
    const elegido = e.target.files[0];
    if (!elegido) return;
    setFile(elegido);

    Papa.parse(elegido, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const resultado = analizarProductosCsv({ fields: results.meta.fields || [], rows: results.data });
        setAnalisis(resultado);
        if (resultado.total === 0) {
          setError('El archivo CSV está vacío.');
        } else if (resultado.faltantes.length > 0) {
          setError(`Error de formato. Faltan columnas obligatorias: ${resultado.faltantes.join(', ')}`);
        } else {
          setFilas(results.data);
        }
      },
      error: () => setError('No se pudo leer el archivo. Verifica que sea un CSV.'),
    });
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + COLUMNAS.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_productos_vendita.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file || filas.length === 0) {
      setError('Por favor, selecciona un archivo CSV válido.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setUploadResults(null);

    try {
      const response = await uploadProducts(filas);
      setMessage(response.message);
      setUploadResults({
        successCount: response.successCount,
        errorCount: response.errorCount,
        errors: response.errors || [],
      });
      setFile(null);
      setFilas([]);
      setAnalisis(null);
    } catch (err) {
      // Intentar extraer error detallado del backend
      let detailedError = "Error en la carga masiva.";
      try {
        const parsedErr = JSON.parse(err.message);
        detailedError = parsedErr.error || detailedError;
      } catch (e) { detailedError = err.message; }

      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Importación <span className="text-emerald-500">Masiva</span></h2>
        <p className="text-gray-500 font-medium text-lg">Actualiza tu inventario global en un solo paso.</p>
      </div>

      {/* Ayuda: armar el archivo es lo más difícil, sobre todo desde el celular */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-[2rem] p-5">
        <div className="flex-1">
          <p className="font-black text-emerald-900">¿Te cuesta armar tu archivo de carga?</p>
          <p className="text-sm text-emerald-700 font-medium">Escríbenos y te ayudamos a crear tu documento de subida masiva.</p>
        </div>
        <a
          href={whatsappLink(MSG_AYUDA)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-black px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95"
        >
          <FaWhatsapp /> Pedir ayuda por WhatsApp
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna de Instrucciones Técnicas (RECUPERADA Y MEJORADA) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold">
              <FaInfoCircle /> <h4>Requisitos del CSV</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Columnas Obligatorias</p>
                <div className="flex flex-wrap gap-1">
                  {COLUMNAS_OBLIGATORIAS.map(h => (
                    <code key={h} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{h}</code>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Columnas Opcionales</p>
                <div className="flex flex-wrap gap-1">
                  {COLUMNAS_OPCIONALES.map(h => (
                    <code key={h} className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-mono">{h}</code>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleDownloadTemplate}
              className="w-full mt-6 py-3 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-600 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <FaDownload size={12} /> Descargar Plantilla CSV
            </button>
          </div>
        </div>

        {/* Zona de Carga */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`relative border-4 border-dashed rounded-[3rem] p-8 sm:p-12 transition-all flex flex-col items-center justify-center text-center ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 bg-white hover:border-emerald-200'}`}>
            <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transition-transform ${file ? 'bg-emerald-500 text-white scale-110' : 'bg-gray-50 text-gray-300'}`}>
              {file ? <FaFileCsv size={40} /> : <FaCloudUploadAlt size={40} />}
            </div>

            {file ? (
              <div className="animate-bounceIn">
                <p className="text-emerald-900 font-black text-xl break-all">{file.name}</p>
                <p className="text-emerald-600 text-sm font-medium italic">Archivo elegido. Toca para cambiarlo.</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-900 font-black text-xl">Toca para elegir tu archivo CSV</p>
                <p className="text-gray-400 text-sm font-medium">o suéltalo aquí desde tu computador</p>
              </div>
            )}
          </div>

          {/* Qué trae el archivo, antes de subirlo */}
          {analisis && analisis.total > 0 && (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm">
              <p className="font-black text-gray-800 flex items-center gap-2">
                <FaCheckCircle className={analisis.faltantes.length === 0 ? 'text-emerald-500' : 'text-gray-300'} />
                Encontramos {analisis.total} producto{analisis.total === 1 ? '' : 's'} en tu archivo
              </p>
              {analisis.muestra.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Por ejemplo: {analisis.muestra.join(', ')}{analisis.total > analisis.muestra.length ? '…' : ''}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || filas.length === 0 || loading}
            className="w-full bg-gray-900 text-white font-black py-5 rounded-[2rem] shadow-2xl hover:bg-emerald-600 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando Base de Datos...
              </span>
            ) : 'Sincronizar Inventario'}
          </button>

          {/* Mensajes de Estado */}
          {error && (
            <div className="flex items-start gap-3 p-5 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 animate-shake">
              <FaTimesCircle className="mt-1 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-black uppercase text-[10px] tracking-widest mb-1">Error Detectado</p>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {message && (
            <div className="flex items-center gap-3 p-5 bg-emerald-50 text-emerald-700 rounded-[2rem] border border-emerald-100 shadow-sm">
              <FaCheckCircle className="flex-shrink-0" />
              <p className="font-bold text-sm">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Resultados Detallados (Si existen) */}
      {uploadResults && (
        <div className="bg-white rounded-[2.5rem] shadow-lg border border-gray-100 p-8 animate-slideUp">
          <h3 className="text-xl font-black mb-6 text-gray-800 flex items-center gap-2">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            Análisis de Importación
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Cargados con éxito</p>
              <p className="text-5xl font-black text-emerald-900">{uploadResults.successCount}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100">
              <p className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-1">Filas con error</p>
              <p className="text-5xl font-black text-red-900">{uploadResults.errorCount}</p>
            </div>
          </div>

          {uploadResults.errors.length > 0 && (
            <div className="space-y-3">
              <p className="font-black text-gray-400 text-[10px] uppercase tracking-widest ml-2">Log de errores detallado</p>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {uploadResults.errors.map((err, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-2xl text-xs border border-gray-100 flex gap-3">
                    <span className="font-black text-red-500">#{index + 1}</span>
                    <div>
                      <p className="text-gray-800 font-bold mb-1">{err.error}</p>
                      <p className="text-gray-400 font-mono">Dato: {JSON.stringify(err.rowData)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductUploadPage;