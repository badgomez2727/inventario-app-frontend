// Aviso fijo, visible para TODOS los usuarios de la compañía, cuando la prueba
// gratis terminó y no se ha activado un plan: la cuenta queda en solo lectura
// (el backend rechaza cualquier cambio, ver authMiddleware). Sin este aviso,
// cada botón que intente guardar algo fallaría sin explicación.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlanStatus } from '../services/apiService';
import { FaLock } from 'react-icons/fa';

export default function ReadOnlyBanner() {
  const [soloLectura, setSoloLectura] = useState(false);

  useEffect(() => {
    let cancelado = false;
    getPlanStatus()
      .then((estado) => {
        if (!cancelado) setSoloLectura(estado?.plan === 'VENCIDO');
      })
      .catch(() => {
        // Si no se puede consultar, no se muestra nada: el aviso nunca debe romper la pantalla.
      });
    return () => {
      cancelado = true;
    };
  }, []);

  if (!soloLectura) return null;

  return (
    <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center flex-shrink-0">
        <FaLock />
      </div>
      <div className="flex-1">
        <p className="font-black text-red-700">Tu prueba gratis terminó: tu cuenta está en modo solo lectura</p>
        <p className="text-sm text-gray-600">
          Puedes ver toda tu información, pero no modificarla. Activa tu plan para volver a vender y editar tu inventario.
        </p>
      </div>
      <Link
        to="/apoyar"
        className="flex-shrink-0 text-center px-5 py-2.5 rounded-xl text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95"
      >
        Activar mi plan
      </Link>
    </div>
  );
}
