import React from 'react';

// Visible en cualquier entorno que no sea producción (staging, previews de
// Vercel), para que nadie confunda datos de prueba con datos reales.
// Se activa con REACT_APP_ENVIRONMENT=staging (ver README: variables de entorno).
function StagingBanner() {
  if (process.env.REACT_APP_ENVIRONMENT !== 'staging') return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[100] bg-amber-500 text-amber-950 text-center text-xs font-black uppercase tracking-widest py-1.5 shadow-md">
      ⚠️ Entorno de STAGING — datos de prueba, no es producción
    </div>
  );
}

export default StagingBanner;
