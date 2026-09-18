// Fotos de un producto para el catálogo público: subir (con cámara o
// galería), reordenar (la primera es la portada) y eliminar. Solo aplica a
// productos ya guardados (necesita un id real para asociar las fotos).

import React, { useState, useRef } from 'react';
import { uploadProductImage, deleteProductImage, reorderProductImages } from '../services/apiService';
import { FaCamera, FaTrashAlt, FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa';

const ProductImageManager = ({ productId, initialImages = [] }) => {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const nuevaImagen = await uploadProductImage(productId, file);
        setImages((prev) => [...prev, nuevaImagen]);
      }
    } catch (err) {
      setError(err.message || 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('¿Eliminar esta foto?')) return;
    setError(null);
    try {
      await deleteProductImage(productId, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la foto.');
    }
  };

  const handleMove = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const reordenadas = [...images];
    [reordenadas[index], reordenadas[target]] = [reordenadas[target], reordenadas[index]];
    setImages(reordenadas);

    try {
      await reorderProductImages(productId, reordenadas.map((img) => img.id));
    } catch (err) {
      setError(err.message || 'No se pudo guardar el nuevo orden.');
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-purple-700 border-b pb-2">
        <FaCamera /> <h3 className="font-bold uppercase tracking-wider text-sm">Fotos del catálogo público</h3>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {images.map((img, index) => (
          <div key={img.id} className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 group">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            {index === 0 && (
              <span className="absolute top-1 left-1 bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                Portada
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0}
                className="p-1.5 bg-white/90 rounded-lg text-gray-700 disabled:opacity-30" title="Mover antes">
                <FaArrowLeft size={10} />
              </button>
              <button type="button" onClick={() => handleDelete(img.id)}
                className="p-1.5 bg-white/90 rounded-lg text-red-500" title="Eliminar">
                <FaTrashAlt size={10} />
              </button>
              <button type="button" onClick={() => handleMove(index, 1)} disabled={index === images.length - 1}
                className="p-1.5 bg-white/90 rounded-lg text-gray-700 disabled:opacity-30" title="Mover después">
                <FaArrowRight size={10} />
              </button>
            </div>
          </div>
        ))}

        <label className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-purple-400 hover:text-purple-500 cursor-pointer transition-colors">
          {uploading ? <FaSpinner className="animate-spin" size={20} /> : <FaCamera size={20} />}
          <span className="text-[10px] font-bold uppercase text-center px-1">
            {uploading ? 'Subiendo...' : 'Agregar foto'}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFilesSelected}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
      <p className="text-[10px] text-gray-400">
        La primera foto es la que se muestra como portada en el catálogo público. Usa las flechas para reordenar.
      </p>
    </section>
  );
};

export default ProductImageManager;
