// Catálogo público de una compañía (/catalogo/:slug) — sin login, pensado
// para que cualquier cliente lo abra desde un link compartido por
// WhatsApp/redes. Por ahora es solo de lectura (el carrito y el pedido
// llegan en la siguiente parte del bloque).

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCatalogoPublico } from '../services/apiService';
import { formatCOP } from '../utils/formatters';
import { FaStore, FaBoxOpen, FaExternalLinkAlt } from 'react-icons/fa';

const PublicCatalogPage = () => {
  const { slug } = useParams();
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getCatalogoPublico(slug);
        setCatalogo(data);
      } catch (err) {
        if (err.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogo();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (notFound || !catalogo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
        <FaBoxOpen size={48} className="text-gray-300" />
        <h1 className="text-xl font-black text-gray-700">Catálogo no encontrado</h1>
        <p className="text-gray-400 text-sm">Este link no corresponde a ningún catálogo activo.</p>
      </div>
    );
  }

  const { company, products } = catalogo;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Portada */}
      <header className="bg-gray-900 text-white">
        {company.fotoPortadaCatalogo && (
          <div className="h-40 md:h-56 w-full overflow-hidden">
            <img src={company.fotoPortadaCatalogo} alt="" className="w-full h-full object-cover opacity-70" />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center flex-shrink-0">
            <FaStore size={20} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black">{company.nombre}</h1>
            {company.descripcionCatalogo && (
              <p className="text-gray-300 text-sm max-w-xl">{company.descripcionCatalogo}</p>
            )}
          </div>
        </div>
      </header>

      {/* Productos */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaBoxOpen size={40} className="mx-auto mb-3" />
            <p className="font-bold">Todavía no hay productos publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="aspect-square bg-gray-100 relative">
                  {p.imagenes[0] ? (
                    <img src={p.imagenes[0]} alt={p.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FaBoxOpen size={32} />
                    </div>
                  )}
                  {!p.disponible && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase">
                      Agotado
                    </span>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <p className="font-bold text-gray-800 text-sm leading-tight flex-1">{p.nombre}</p>
                  {p.categoria && <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">{p.categoria}</p>}
                  <p className="font-black text-purple-600 mt-2">{formatCOP(p.precioVenta)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Pie "Hecho con Vendita" */}
      <footer className="py-6 text-center border-t border-gray-100 bg-white">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors">
          Hecho con <span className="text-purple-600">Vendita</span> <FaExternalLinkAlt size={9} />
        </Link>
      </footer>
    </div>
  );
};

export default PublicCatalogPage;
